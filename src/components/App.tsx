import React, { useState } from "react";
import { Editor, EditorState } from 'draft-js';
import 'draft-js/dist/Draft.css';

const App: React.FC = () => {
    const [editorState, setEditorState] = useState(() => EditorState.createEmpty());

    return (
        <>
            <button onClick={() => {}}><b>B</b></button>
            <button onClick={() => {}}><i>I</i></button>
            <button onClick={() => {}}><u>U</u></button>
            <Editor editorState={editorState} onChange={setEditorState} />
        </>
    );
}

export default App;
