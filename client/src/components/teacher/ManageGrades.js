// ManageGrades.js
import React, { useState, useEffect } from "react";
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Box,
  Select,
  MenuItem,
  TextField,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Paper,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { submitGradeRequest } from "../../api/student";

const getFinalGrade = (grades) => {
  let final = 0;
  for (const grade of grades) {
    if (grade.grade === 0) {
      return ["-", "black"];
    }
    final += grade.grade * grade.percentage;
  }
  return [final.toFixed(2), final >= 5 ? "green" : "red"];
};

const ManageGrades = (props) => {
  const [selectedCourse, setSelectedCourse] = useState("");
  const [students, setStudents] = useState([]);

  useEffect(() => {
    if (selectedCourse) {
      setStudents(props.courses[selectedCourse]["enroledStudents"]);
    }
  }, [selectedCourse]);

  const handleGradeChange = (studentId, gradeIndex, value) => {
    const validatedGrade = Math.min(Math.max(parseFloat(value) || 0, 0), 10); // Ensures grade is between 0 and 10
    setStudents((prevStudents) =>
      prevStudents.map((student) => {
        if (student.studentId === studentId) {
          const updatedGrades = [...student.grades];
          updatedGrades[gradeIndex].grade = validatedGrade;
          return { ...student, grades: updatedGrades };
        }
        return student;
      })
    );
  };

  const saveGrades = async (studentId) => {
    try {
      const student = students.find((s) => s.studentId === studentId);
      if (!student) return;
      console.log(
        `Saving grades for course ${selectedCourse} for student ${student.studentId}`,
        student.grades
      );
      const response = await submitGradeRequest(
        selectedCourse,
        student.studentId,
        student.grades
      );
      console.log("Response: ", response);
      if (response.status >= 400 && response.status < 500) {
        const message = await response.json();
        console.error("Error saving grades: ", message);
        return;
      }
    } catch (error) {
      console.error("Error saving grades: ", error);
    }
  };

  return (
    <Box>
      <Select
        value={selectedCourse || ""}
        onChange={(e) => setSelectedCourse(e.target.value)}
        displayEmpty
        fullWidth
        sx={{ marginBottom: 2 }}
      >
        <MenuItem value="" disabled>
          Select a course
        </MenuItem>
        {Object.entries(props.courses).map(([_, course]) => (
          <MenuItem key={course.courseCode} value={course.courseCode}>
            {`${course.courseName} (${course.courseCode})`}
          </MenuItem>
        ))}
      </Select>

      {selectedCourse && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center">Student Name</TableCell>
                <TableCell align="center">Final Grade</TableCell>
                <TableCell align="center">Grades</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {students.map((student) => (
                <TableRow key={student.studentId}>
                  <TableCell align="center">{`${student.studentFirstName} ${student.studentLastName}`}</TableCell>
                  <TableCell
                    align="center"
                    style={{ color: getFinalGrade(student.grades)[1] }}
                  >
                    {getFinalGrade(student.grades)[0]}
                  </TableCell>
                  <TableCell align="center">
                    <Accordion>
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                      >
                        <Typography>Edit Grades</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell align="center">Description</TableCell>
                              <TableCell align="center">Grade</TableCell>
                              <TableCell align="center">Percentage</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {student.grades.map((grade, idx) => (
                              <TableRow key={idx}>
                                <TableCell align="center">
                                  {grade.description}
                                </TableCell>
                                <TableCell align="center">
                                  <TextField
                                    type="number"
                                    variant="outlined"
                                    size="small"
                                    value={grade.grade}
                                    onChange={(e) =>
                                      handleGradeChange(
                                        student.studentId,
                                        idx,
                                        e.target.value
                                      )
                                    }
                                    InputProps={{
                                      style: {
                                        color:
                                          grade.grade >= 5 ? "green" : "red",
                                      },
                                    }}
                                  />
                                </TableCell>
                                <TableCell align="center">
                                  {(grade.percentage * 100).toFixed(2)}%
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </AccordionDetails>
                    </Accordion>
                  </TableCell>
                  <TableCell align="center">
                    <Button
                      variant="contained"
                      color="primary"
                      sx={{ marginRight: 1 }}
                      onClick={() => saveGrades(student.studentId)}
                    >
                      Save
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default ManageGrades;
