import React from "react";
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
} from "@mui/material";

const GradesManagementSection = () => {
  const sampleGrades = [
    { studentName: "John Doe", course: "Mathematics", grade: "9.5" },
    { studentName: "Jane Smith", course: "Physics", grade: "8.0" },
  ];

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Manage Grades
      </Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Student Name</TableCell>
              <TableCell>Course</TableCell>
              <TableCell>Grade</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sampleGrades.map((grade, index) => (
              <TableRow key={index}>
                <TableCell>{grade.studentName}</TableCell>
                <TableCell>{grade.course}</TableCell>
                <TableCell>{grade.grade}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    color="primary"
                    sx={{ marginRight: 1 }}
                  >
                    Edit
                  </Button>
                  <Button variant="outlined" color="error">
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default GradesManagementSection;
