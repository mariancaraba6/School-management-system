import { getToken, URL } from "./utils";

export const addStudentRequest = async (student) => {
  return fetch(URL + "admin/student", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getToken()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(student),
  });
};

export const addProfessorRequest = async (professor) => {
  return fetch(URL + "admin/professor", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getToken()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(professor),
  });
};

export const addCourseRequest = async (course) => {
  return fetch(URL + "admin/course", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getToken()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(course),
  });
};
