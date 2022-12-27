import React from "react";

const App: React.FC = () => {
    const toggleFormat = (format: string) => {
        const selection = window.getSelection();

        if (selection && selection.rangeCount) {
            const range = selection.getRangeAt(0);
            const newNode = document.createElement(format);
            newNode.appendChild(range.extractContents());
            range.insertNode(newNode);
        }
    };

    return (
        <div>
            <button onClick={() => toggleFormat("b")}><b>B</b></button>
            <button onClick={() => toggleFormat("i")}><i>I</i></button>
            <button onClick={() => toggleFormat("u")}><u>U</u></button>
            <button style={{ backgroundColor: "#ff0000" }}>C</button>
            <div id="editor" contentEditable={true} />
        </div>
    )
}

export default App;
