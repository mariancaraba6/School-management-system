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

const getFinalGrade = (grades) => {
  let final = 0;
  for (const grade of grades) {
    if (grade.grade === "null") {
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

const Courses = ({ courses }) => {
  return (
    <Box>
      {courses.map((course, index) => {
        const finalGrade = getFinalGrade(course.grades);
        return (
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
                    color: finalGrade[1],
                  }}
                >
                  {finalGrade[0]}
                </strong>
              </Typography>
            </CardContent>

            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography>View All Grades</Typography>
              </AccordionSummary>
              <AccordionDetails>
                {course.grades.length > 0 ? (
                  <TableContainer>
                    <Table>
                      <TableBody>
                        {course.grades
                          .sort((a, b) => a.id - b.id)
                          .map((grade, idx) => (
                            <TableRow key={idx}>
                              <TableCell>{`${grade.description} (${(
                                grade.percentage * 100
                              ).toFixed(2)}%)`}</TableCell>
                              <TableCell>
                                {grade.grade === "null"
                                  ? "-"
                                  : grade.grade.toFixed(2)}
                              </TableCell>
                              <TableCell>
                                {grade.grade === "null"
                                  ? ""
                                  : new Date(grade.date).toDateString()}
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : (
                  <Typography>No grades recorded for this course.</Typography>
                )}
              </AccordionDetails>
            </Accordion>

            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography>View All Absences</Typography>
              </AccordionSummary>
              <AccordionDetails>
                {course.absences.length > 0 ? (
                  <TableContainer>
                    <Table>
                      <TableBody>
                        {course.absences.map((absence, idx) => (
                          <TableRow key={idx}>
                            <TableCell>{getDateFormat(absence.date)}</TableCell>
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
        );
      })}
    </Box>
  );
};

export default Courses;
