// ManageAttendance.js
import React, { useState, useEffect, useCallback } from "react";
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
import LoadingPage from "../../LoadingPage";
import { getGradesRequest } from "../../api/professor";

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

const ManageAttendance = () => {
  const [selectedCourse, setSelectedCourse] = useState("");
  const [students, setStudents] = useState(null);
  const [openMotivateDialog, setOpenMotivateDialog] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const fetchStudentAbsences = useCallback(async () => {
    setStudents(null);
    try {
      const response = await getGradesRequest();
      if (response.status === 200) {
        const data = await response.json();
        console.log("Student absences: ", data);
        setStudents(data["courses"]);
      }
    } catch (error) {
      console.error("Error getting student absences: ", error);
    }
  }, []);

  useEffect(() => {
    fetchStudentAbsences();
  }, [fetchStudentAbsences]);

  const saveAbsences = async (studentId, absences) => {
    try {
      console.log(
        `Saving absences for course ${selectedCourse} for student ${studentId}`,
        absences
      );
      const response = await submitAbsenceRequest(
        selectedCourse,
        studentId,
        absences
      );
      if (response.status === 200) {
        console.log("The absence added/updated successfully.");
        fetchStudentAbsences();
        return;
      }
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
    saveAbsences(studentId, [{}]);
  };

  const motivateAbsence = (studentId, absenceIndex) => {
    try {
      const student = students[selectedCourse]["enroledStudents"].find(
        (x) => x.studentId === studentId
      );
      if (!student) {
        return;
      }
      student.absences[absenceIndex].motivated = true;
      saveAbsences(studentId, [student.absences[absenceIndex]]);
      setOpenMotivateDialog(false);
    } catch (error) {
      console.error("Error motivating absence: ", error);
    }
  };

  const handleOpenMotivateDialog = (student) => {
    setSelectedStudent(student);
    setOpenMotivateDialog(true);
  };

  const handleCloseMotivateDialog = () => {
    setOpenMotivateDialog(false);
    setSelectedStudent(null);
  };

  if (students === null) {
    return <LoadingPage />;
  }

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
        {Object.entries(students).map(([_, course]) => (
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
              {students[selectedCourse]["enroledStudents"].map((student) => (
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
