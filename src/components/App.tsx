import React, { useState } from "react";
import { Editor, EditorState } from 'draft-js';
import 'draft-js/dist/Draft.css';

const App: React.FC = () => {
    const [editorState, setEditorState] = useState(() => EditorState.createEmpty());

    console.log(editorState);

    return <Editor editorState={editorState} onChange={setEditorState} />;
}

export default App;
