import React, { useState, useRef, useEffect } from "react";

const App: React.FC = () => {
    const [content, setContent] = useState(`Lorem ipsum dolor sit amet, <i>consectetur</i> adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`);
    const [selectedContent, setSelectedContent] = useState("");

    const editorRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!editorRef.current) return;
        else editorRef.current.innerHTML = content;
    }, []);

    const handleSelection = () => {
        let selectionData = document.getSelection();

        if (selectionData?.rangeCount) {
            let container = document.createElement("div");

            for (let i = 0; i < selectionData.rangeCount; ++i) {
                container.appendChild(selectionData.getRangeAt(i).cloneContents());
            }

            setSelectedContent(container.innerHTML);
        }
    }

    return (
        <>
            <button>RED</button>
            <button>GREEN</button>
            <button>BLUE</button>
            <div
                ref={editorRef}
                contentEditable="true"
                style={{ whiteSpace: "pre-wrap" }}
                onInput={(event) => setContent(event.currentTarget.innerHTML)}
                onSelect={handleSelection} />
        </>
    )
}

export default App;
