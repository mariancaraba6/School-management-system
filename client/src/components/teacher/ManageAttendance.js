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
import { submitAbsenceRequest } from "../../api/student";

const getCurrentDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = (today.getMonth() + 1).toString().padStart(2, "0");
  const day = today.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const getDateFormat = (date) => {
  const now = new Date(date);
  let year = now.getFullYear();
  let month = (now.getMonth() + 1).toString().padStart(2, "0"); // Months are zero-based
  let day = now.getDate().toString().padStart(2, "0");

  let formattedDate = `${year}-${month}-${day}`;
  return formattedDate;
};

const ManageAttendance = (props) => {
  const [selectedCourse, setSelectedCourse] = useState("");
  const [students, setStudents] = useState([]);
  const [openMotivateDialog, setOpenMotivateDialog] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    if (selectedCourse) {
      setStudents(props.courses[selectedCourse]["enroledStudents"]);
    }
  }, [selectedCourse]);

  const saveAbsences = async (studentId, absences) => {
    try {
      const student = students.find((s) => s.studentId === studentId);
      if (!student) return;
      console.log(
        `Saving absences for course ${selectedCourse} for student ${student.studentId}`,
        absences
      );
      const response = await submitAbsenceRequest(
        selectedCourse,
        student.studentId,
        absences
      );
      console.log("Response: ", response);
      if (response.status >= 400 && response.status < 500) {
        const message = await response.json();
        console.error("Error saving absences: ", message);
        return;
      }
    } catch (error) {
      console.error("Error saving absences: ", error);
    }
  };

  const addAbsence = (studentId) => {
    const currentDate = getCurrentDate();
    setStudents((prevStudents) => {
      const result = prevStudents.map((student) => {
        if (student.studentId === studentId) {
          return {
            ...student,
            absences: [
              ...student.absences,
              { date: currentDate, motivated: false },
            ],
          };
        }
        return student;
      });
      saveAbsences(
        studentId,
        result.find((s) => s.studentId === studentId).absences
      );
      return result;
    });
  };

  const motivateAbsence = (studentId, absenceIndex) => {
    setStudents((prevStudents) => {
      const result = prevStudents.map((student) => {
        if (student.studentId === studentId) {
          const updatedAbsences = [...student.absences];
          updatedAbsences[absenceIndex].motivated = true;
          return { ...student, absences: updatedAbsences };
        }
        return student;
      });
      saveAbsences(
        studentId,
        result.find((s) => s.studentId === studentId).absences
      );
      return result;
    });
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
                <TableCell align="center">Absences</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {students.map((student) => (
                <TableRow key={student.studentId}>
                  <TableCell align="center">{`${student.studentFirstName} ${student.studentLastName}`}</TableCell>
                  <TableCell align="center">
                    {student.absences.length > 0 ? (
                      student.absences.map((absence, index) => (
                        <div
                          key={index}
                          style={{
                            color: absence.motivated ? "green" : "red",
                          }}
                        >
                          {getDateFormat(absence.date)}
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
                        onClick={() => addAbsence(student.studentId)}
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
                      <TableCell align="center">
                        {getDateFormat(absence.date)}
                      </TableCell>
                      <TableCell align="center">
                        {!absence.motivated && (
                          <Button
                            variant="outlined"
                            color="primary"
                            onClick={() =>
                              motivateAbsence(selectedStudent.studentId, index)
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
