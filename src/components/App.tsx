import React, { useState, useRef, useEffect } from "react";

const App: React.FC = () => {
    const [content, setContent] = useState(`Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`);

    const editorRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!editorRef.current) return;
        else editorRef.current.innerHTML = content;
    }, []);

    const handleSelection = () => {
        let sel = document.getSelection();
        console.log("selection: " + sel);
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
