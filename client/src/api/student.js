import { getToken, URL } from "./utils";

export const getDetailsRequest = async () => {
  return fetch(URL + "student/details", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
};

export const getGradesRequest = async () => {
  return fetch(URL + "student/grades", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
};

export const submitGradeRequest = async (courseId, studentId, grades) => {
  return fetch(URL + "professor/grades", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getToken()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ courseId, studentId, grades }),
  });
};

export const submitAbsenceRequest = async (courseId, studentId, absences) => {
  return fetch(URL + "professor/absences", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getToken()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ courseId, studentId, absences }),
  });
};
