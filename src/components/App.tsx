import React, { useState } from "react";

const App: React.FC = () => {
    const [fontColor, setFontColor] = useState("#ff0000");

    const applyFormat = (format: string) => {
        const selection = window.getSelection();

        if (selection && selection.rangeCount) {
            const range = selection.getRangeAt(0);
            const formatNode = document.createElement(format);

            formatNode.appendChild(range.extractContents());
            range.insertNode(formatNode);
        }
    };

    const applyColor = () => {
        const selection = window.getSelection();

        if (selection && selection.rangeCount) {
            const range = selection.getRangeAt(0);
            const colorNode = document.createElement("span");

            colorNode.style.color = fontColor;
            colorNode.appendChild(range.extractContents());
            range.insertNode(colorNode);
        }
    }

    const removeFormat = () => {
        const selection = window.getSelection();
        if (selection && selection.rangeCount) {
            let range = selection.getRangeAt(0);
            let selectedTextNode = document.createTextNode(range.toString());
            range.deleteContents();
            range.insertNode(selectedTextNode);
            range.selectNode(selectedTextNode);
            selection.removeAllRanges();
            selection.addRange(range);
        }
    }

    return (
        <div>
            <button onClick={() => applyFormat("b")}><b>B</b></button>
            <button onClick={() => applyFormat("i")}><i>I</i></button>
            <button onClick={() => applyFormat("u")}><u>U</u></button>
            <button onClick={() => removeFormat()}>X</button>
            <button onClick={() => applyColor()} style={{ backgroundColor: fontColor }}>C</button>
            <input type="color" onChange={(event) => setFontColor(event.currentTarget.value)} />
            <div id="editor" contentEditable={true} />
        </div>
    )
}

export default App;
