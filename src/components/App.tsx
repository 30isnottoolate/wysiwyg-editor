import React from "react";

const App: React.FC = () => {
    return (
        <div>
            <button><b>B</b></button>
            <button><i>I</i></button>
            <button><u>U</u></button>
            <button style={{backgroundColor: "#ff0000"}}>C</button>
            <div id="editor" contentEditable={true} placeholder="Write something..." />
        </div>
    )
}

export default App;
