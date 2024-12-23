import React from "react";
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
} from "@mui/material";

const AttendanceSection = () => {
  const sampleAttendance = [
    { studentName: "John Doe", date: "2024-01-15", status: "Present" },
    { studentName: "Jane Smith", date: "2024-01-16", status: "Absent" },
  ];

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Manage Attendance
      </Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Student Name</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sampleAttendance.map((record, index) => (
              <TableRow key={index}>
                <TableCell>{record.studentName}</TableCell>
                <TableCell>{record.date}</TableCell>
                <TableCell>{record.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AttendanceSection;
