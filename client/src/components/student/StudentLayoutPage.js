import React from "react";
import { useEffect } from "react";
import { getDetailsRequest, getGradesRequest } from "../../api/student";

export default function StudentLayoutPage({ props }) {
    const [grades, setGrades] = React.useState([]);
    const [details, setDetails] = React.useState({});

    useEffect(() => {
        async function getDetails() {
            try {
                const response = await getDetailsRequest();
                if (response.status === 200) {
                    const data = await response.json();
                    console.log("Details: ", data);
                    setDetails(data);
                }
            } catch (error) {
                console.error("Error getting details: ", error);
            }
        }

        async function getGrades() {
            try {
                const response = await getGradesRequest();
                if (response.status === 200) {
                    const data = await response.json();
                    console.log("Grades: ", data);
                    setGrades(data["grades"]);
                }
            } catch (error) {
                console.error("Error getting grades: ", error);
            }
        }

        getDetails();
        getGrades();
    }, []);

    return (
        <>
            {details && (
                <>
                    <h1>Student Details</h1>
                    <p>Student ID: {details.student_id}</p>
                    <p>Name: {details.first_name + " " + details.last_name}</p>
                    <p>Email: {details.email}</p>
                </>
            )}
            {grades && (
                <>
                    <h1>Grades</h1>
                    <ul>
                        {grades.map((grade, index) => (
                            <li key={index}>
                                <p>Course ID: {grade[0]}</p>
                                <p>Grade: {grade[1]}</p>
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </>
    );
}
