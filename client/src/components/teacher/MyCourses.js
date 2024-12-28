import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Paper,
  MenuItem,
  Select,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

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

const getDateFormat = (date) => {
  const now = new Date(date);
  let year = now.getFullYear();
  let month = (now.getMonth() + 1).toString().padStart(2, "0"); // Months are zero-based
  let day = now.getDate().toString().padStart(2, "0");

  let formattedDate = `${year}-${month}-${day}`;
  return formattedDate;
};

const MyCourses = (props) => {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [students, setStudents] = useState([]);

  useEffect(() => {
    if (selectedCourse) {
      setStudents(props.courses[selectedCourse]["enroledStudents"]);
    }
  }, [selectedCourse]);

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
                <TableCell align="center">Absences</TableCell>
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
                    {student.grades.length > 0 ? (
                      <Accordion>
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon />}
                          aria-controls="panel1a-content"
                          id="panel1a-header"
                        >
                          <Typography align="center">View Grades</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Table>
                            <TableHead>
                              <TableRow>
                                <TableCell align="center">
                                  Description
                                </TableCell>
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
                                  <TableCell
                                    align="center"
                                    style={{
                                      color:
                                        grade.grade === 0
                                          ? "black"
                                          : grade.grade >= 5
                                          ? "green"
                                          : "red",
                                    }}
                                  >
                                    {grade.grade === 0 ? "-" : grade.grade}
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
                    ) : (
                      "No grades"
                    )}
                  </TableCell>
                  <TableCell align="center">
                    {student.absences.length > 0 ? (
                      <Accordion>
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon />}
                          aria-controls="panel1a-content"
                          id="panel1a-header"
                        >
                          <Typography align="center">View Absences</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          {student.absences.map((absence, idx) => (
                            <Typography
                              align="center"
                              key={idx}
                              style={{
                                color: absence.motivated ? "green" : "red",
                              }}
                            >
                              {getDateFormat(absence.date)}
                            </Typography>
                          ))}
                        </AccordionDetails>
                      </Accordion>
                    ) : (
                      "No absences"
                    )}
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

export default MyCourses;
