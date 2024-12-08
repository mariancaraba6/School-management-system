import React from "react";
import LoginPage from "./components/login/LoginPage";
import StudentLayoutPage from "./components/student/StudentLayoutPage";

function App() {
    const [loggedIn, setLoggedIn] = React.useState(false);

    return (
        <>
            {loggedIn ? (
                <StudentLayoutPage setLoggedIn={setLoggedIn} />
            ) : (
                <LoginPage setLoggedIn={setLoggedIn} />
            )}
        </>
    );
}

export default App;
