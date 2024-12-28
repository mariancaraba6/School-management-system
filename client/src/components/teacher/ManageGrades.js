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

const mockCourses = [
  { id: "course1", name: "Mathematics" },
  { id: "course2", name: "Physics" },
  { id: "course3", name: "Chemistry" },
];

const mockStudents = {
  course1: [
    {
      id: "student1",
      name: "John Doe",
      grades: [
        { description: "Test 1", grade: 8, percentage: 0.4 },
        { description: "Test 2", grade: 9, percentage: 0.6 },
      ],
    },
    {
      id: "student2",
      name: "Jane Smith",
      grades: [
        { description: "Assignment", grade: 7, percentage: 0.5 },
        { description: "Final Exam", grade: 6, percentage: 0.5 },
      ],
    },
  ],
  course2: [
    {
      id: "student3",
      name: "Albert Einstein",
      grades: [{ description: "Midterm", grade: 10, percentage: 1 }],
    },
  ],
  course3: [
    {
      id: "student4",
      name: "Marie Curie",
      grades: [
        { description: "Lab Work", grade: 9, percentage: 0.4 },
        { description: "Theory Exam", grade: 10, percentage: 0.6 },
      ],
    },
  ],
};

const calculateFinalGrade = (grades) => {
  let final = 0;
  for (const grade of grades) {
    final += grade.grade * grade.percentage;
  }
  return final.toFixed(2);
};

const ManageGrades = () => {
  const [selectedCourse, setSelectedCourse] = useState("");
  const [students, setStudents] = useState([]);

  useEffect(() => {
    if (selectedCourse) {
      setStudents(mockStudents[selectedCourse] || []);
    }
  }, [selectedCourse]);

  const handleGradeChange = (studentId, gradeIndex, value) => {
    const validatedGrade = Math.min(Math.max(parseFloat(value) || 0, 0), 10); // Ensures grade is between 0 and 10
    setStudents((prevStudents) =>
      prevStudents.map((student) => {
        if (student.id === studentId) {
          const updatedGrades = [...student.grades];
          updatedGrades[gradeIndex].grade = validatedGrade;
          return { ...student, grades: updatedGrades };
        }
        return student;
      })
    );
  };

  const saveGrades = (studentId) => {
    const student = students.find((s) => s.id === studentId);
    console.log(`Saving grades for ${student.name}:`, student.grades);
    // Logic to save the grades to the backend can go here
  };

  return (
    <Box>
      <Select
        value={selectedCourse}
        onChange={(e) => setSelectedCourse(e.target.value)}
        displayEmpty
        fullWidth
        sx={{ marginBottom: 2 }}
      >
        <MenuItem value="" disabled>
          Select a course
        </MenuItem>
        {mockCourses.map((course) => (
          <MenuItem key={course.id} value={course.id}>
            {course.name}
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
                <TableRow key={student.id}>
                  <TableCell align="center">{student.name}</TableCell>
                  <TableCell align="center">
                    <Typography
                      style={{
                        color:
                          calculateFinalGrade(student.grades) >= 5
                            ? "green"
                            : "red",
                      }}
                    >
                      {calculateFinalGrade(student.grades)}
                    </Typography>
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
                                        student.id,
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
                      onClick={() => saveGrades(student.id)}
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
