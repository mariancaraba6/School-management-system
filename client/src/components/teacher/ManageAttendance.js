// ManageAttendance.js
import React, { useState, useEffect } from "react";
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  Button,
  Select,
  MenuItem,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
} from "@mui/material";

const mockCourses = [
  { id: "course1", name: "Mathematics" },
  { id: "course2", name: "Physics" },
  { id: "course3", name: "Chemistry" },
];

const mockStudents = {
  course1: [
    { id: "student1", name: "John Doe", absences: [] },
    { id: "student2", name: "Jane Smith", absences: [] },
  ],
  course2: [{ id: "student3", name: "Albert Einstein", absences: [] }],
  course3: [{ id: "student4", name: "Marie Curie", absences: [] }],
};

const getCurrentDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = (today.getMonth() + 1).toString().padStart(2, "0");
  const day = today.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const ManageAttendance = () => {
  const [selectedCourse, setSelectedCourse] = useState("");
  const [students, setStudents] = useState([]);
  const [openMotivateDialog, setOpenMotivateDialog] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    if (selectedCourse) {
      setStudents(mockStudents[selectedCourse] || []);
    }
  }, [selectedCourse]);

  const addAbsence = (studentId) => {
    const currentDate = getCurrentDate();
    setStudents((prevStudents) =>
      prevStudents.map((student) => {
        if (student.id === studentId) {
          return {
            ...student,
            absences: [
              ...student.absences,
              { date: currentDate, motivated: false },
            ],
          };
        }
        return student;
      })
    );
  };

  const motivateAbsence = (studentId, absenceIndex) => {
    setStudents((prevStudents) =>
      prevStudents.map((student) => {
        if (student.id === studentId) {
          const updatedAbsences = [...student.absences];
          updatedAbsences[absenceIndex].motivated = true;
          return { ...student, absences: updatedAbsences };
        }
        return student;
      })
    );
    setOpenMotivateDialog(false);
  };

  const handleOpenMotivateDialog = (student) => {
    setSelectedStudent(student);
    setOpenMotivateDialog(true);
  };

  const handleCloseMotivateDialog = () => {
    setOpenMotivateDialog(false);
    setSelectedStudent(null);
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
                <TableCell align="center">Absences</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {students.map((student) => (
                <TableRow key={student.id}>
                  <TableCell align="center">{student.name}</TableCell>
                  <TableCell align="center">
                    {student.absences.length > 0 ? (
                      student.absences.map((absence, index) => (
                        <div
                          key={index}
                          style={{
                            color: absence.motivated ? "green" : "red",
                          }}
                        >
                          {absence.date}
                        </div>
                      ))
                    ) : (
                      <Typography>No absences</Typography>
                    )}
                  </TableCell>
                  <TableCell align="center">
                    <Stack spacing={1} direction="row" justifyContent="center">
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => addAbsence(student.id)}
                      >
                        Add Absence
                      </Button>
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => handleOpenMotivateDialog(student)}
                      >
                        Motivate
                      </Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {selectedStudent && (
        <Dialog open={openMotivateDialog} onClose={handleCloseMotivateDialog}>
          <DialogTitle>Motivate Absence</DialogTitle>
          <DialogContent>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell align="center">Date</TableCell>
                    <TableCell align="center">Motivate</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {selectedStudent.absences.map((absence, index) => (
                    <TableRow key={index}>
                      <TableCell align="center">{absence.date}</TableCell>
                      <TableCell align="center">
                        {!absence.motivated && (
                          <Button
                            variant="outlined"
                            color="primary"
                            onClick={() =>
                              motivateAbsence(selectedStudent.id, index)
                            }
                          >
                            Motivate
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseMotivateDialog} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
};

export default ManageAttendance;
