import React from "react";

const NavBar = (props) => {
    const [names, setNames] = React.useState(["abc", "def"]);
    const inputRef = React.useRef();

    return (
        <div>
            <p>{props.name}</p>
            <input ref={inputRef} type="text" />
            <button
                onClick={() =>
                    setNames((x) => {
                        return [...x, inputRef.current.value];
                    })
                }
            >
                Click me
            </button>
            {names.map((name) => (
                <p>{name}</p>
            ))}
        </div>
    );
};

export default NavBar;
