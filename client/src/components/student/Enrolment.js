import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

const Enrolment = ({ courses }) => {
  const [searchQuery, setSearchQuery] = useState(""); // Holds the search term
  const [enrolledCourses, setEnrolledCourses] = useState([]); // Stores enrolled courses

  // Map incoming courses data to the expected format
  const mappedCourses = courses.map((course) => ({
    course_id: course.courseCode || "-", // Maps courseCode to course_id
    course_name: course.courseName || "N/A", // Maps courseName to course_name
    course_description: course.description || "No description available",
    course_credits: course.credits || 0,
  }));

  // Filtered courses based on the search query
  const filteredCourses =
    searchQuery.trim() === ""
      ? mappedCourses // Show all courses when searchQuery is empty
      : mappedCourses.filter((course) =>
          course.course_id.toLowerCase().includes(searchQuery.toLowerCase())
        );

  // Function to handle enrolling in a course
  const handleEnrol = async (courseId) => {
    try {
      const studentId = "student123"; // Replace this with the logged-in student's ID
      console.log(`Enrolling in course: ${courseId} for student: ${studentId}`);
      alert("Enrolled successfully!");
      setEnrolledCourses((prev) => [...prev, courseId]);
    } catch (error) {
      console.error("Error enrolling in course:", error);
      alert("Failed to enrol. Please try again.");
    }
  };

  return (
    <Box>
      {/* Search Bar */}
      <Box sx={{ display: "flex", marginBottom: 2 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search for a course by ID..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Button
          variant="contained"
          color="secondary"
          onClick={() => console.log("Search executed")}
          sx={{ marginLeft: 2 }}
        >
          Search
        </Button>
      </Box>

      {/* Course Results */}
      <TableContainer component={Paper} sx={{ marginTop: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center">Course ID</TableCell>
              <TableCell align="center">Course Name</TableCell>
              <TableCell align="center">Description</TableCell>
              <TableCell align="center">Credits</TableCell>
              <TableCell align="center">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCourses.map((course, index) => (
              <TableRow key={index}>
                <TableCell align="center">{course.course_id}</TableCell>
                <TableCell align="center">{course.course_name}</TableCell>
                <TableCell align="center">
                  {course.course_description}
                </TableCell>
                <TableCell align="center">{course.course_credits}</TableCell>
                <TableCell align="center">
                  {enrolledCourses.includes(course.course_id) ? (
                    <Typography color="success.main">Enrolled</Typography>
                  ) : (
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => handleEnrol(course.course_id)}
                    >
                      Enrol
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Enrolment;
