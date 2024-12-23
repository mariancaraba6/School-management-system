import React from "react";
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Card,
  CardContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const GradesSection = ({ courses }) => {
  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Your Grades
      </Typography>

      {courses.map((course, index) => (
        <Card
          key={index}
          variant="outlined"
          sx={{ marginBottom: 2, padding: 2, borderRadius: 2 }}
        >
          <CardContent>
            <Typography variant="h6">{course.courseName}</Typography>
            <Typography variant="subtitle1" color="textSecondary">
              Code: {course.courseCode}
            </Typography>
            <Typography variant="body1">
              Final Grade:{" "}
              <strong
                style={{
                  color: course.finalGrade >= 5 ? "green" : "red",
                }}
              >
                {course.finalGrade}
              </strong>
            </Typography>
          </CardContent>

          {/* Accordion for Absences */}
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography>View Absences</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {course.absences.length > 0 ? (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Date</TableCell>
                        <TableCell>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {course.absences.map((absence, idx) => (
                        <TableRow key={idx}>
                          <TableCell>{absence}</TableCell>
                          <TableCell>Absent</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Typography>No absences recorded for this course.</Typography>
              )}
            </AccordionDetails>
          </Accordion>
        </Card>
      ))}
    </Box>
  );
};

export default GradesSection;
