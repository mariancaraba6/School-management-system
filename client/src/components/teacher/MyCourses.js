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

const mockCourses = [
  { id: "course1", name: "Mathematics", studentCount: 30 },
  { id: "course2", name: "Physics", studentCount: 25 },
  { id: "course3", name: "Chemistry", studentCount: 20 },
];

const mockStudents = {
  course1: [
    {
      id: "student1",
      name: "John Doe",
      grades: [
        { description: "Test 1", grade: 8, percentage: 0.4 },
        { description: "Test 2", grade: null, percentage: 0.6 },
      ],
      absences: [
        { date: "2024-01-01T10:00:00" },
        { date: "2024-01-15T14:30:00" },
      ],
    },
    {
      id: "student2",
      name: "Jane Smith",
      grades: [
        { description: "Assignment", grade: 7, percentage: 0.5 },
        { description: "Final Exam", grade: null, percentage: 0.5 },
      ],
      absences: [],
    },
  ],
  course2: [
    {
      id: "student3",
      name: "Albert Einstein",
      grades: [{ description: "Midterm", grade: 10, percentage: 1 }],
      absences: [{ date: "2024-02-01T08:00:00" }],
    },
  ],
  course3: [
    {
      id: "student4",
      name: "Marie Curie",
      grades: [
        { description: "Lab Work", grade: 9, percentage: 0.4 },
        { description: "Theory Exam", grade: null, percentage: 0.6 },
      ],
      absences: [],
    },
  ],
};

const getFinalGrade = (grades) => {
  let final = 0;
  for (const grade of grades) {
    if (grade.grade === null) {
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
  let hour = now.getHours().toString().padStart(2, "0");
  let minute = now.getMinutes().toString().padStart(2, "0");

  let formattedDate = `${year}-${month}-${day} ${hour}:${minute}`;
  return formattedDate;
};

const MyCourses = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [students, setStudents] = useState([]);

  useEffect(() => {
    // Simulate fetching courses from the backend
    setCourses(mockCourses);
  }, []);

  useEffect(() => {
    if (selectedCourse) {
      // Simulate fetching students for the selected course
      setStudents(mockStudents[selectedCourse] || []);
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
        {courses.map((course) => (
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
                <TableCell align="center">Absences</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {students.map((student) => (
                <TableRow key={student.id}>
                  <TableCell align="center">{student.name}</TableCell>
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
                                      color: grade.grade >= 5 ? "green" : "red",
                                    }}
                                  >
                                    {grade.grade === null ? "-" : grade.grade}
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
                            <Typography align="center" key={idx}>
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
