import React, { useState, useRef } from "react";
import {
    insertText, removeStyleTag, removeSpanTag, surroundWithStyleTag, removeDoubleFormatting, mergeSiblings,
    removeChildlessNodes, ancestorOfNode, topAncestorOfNode, doesNodeHaveAncestor, textNodesOfSelection
} from "../utilities/helperFunctions";
import "./App.css";
import Toolbar from "./Toolbar";

const App: React.FC = () => {
    const [fontColor, setFontColor] = useState("#ff0000");
    const [highlightColor, setHighlightColor] = useState("#ffff00");

    const [fontColorPickerActive, setFontColorPickerActive] = useState(false);
    const [highlightColorPickerActive, setHighlightColorPickerActive] = useState(false);

    const [isItB, setIsItB] = useState(false);
    const [isItI, setIsItI] = useState(false);
    const [isItU, setIsItU] = useState(false);
    const [isItS, setIsItS] = useState(false);
    const [isItSup, setIsItSup] = useState(false);
    const [isItSub, setIsItSub] = useState(false);
    const [isItFontColor, setIsItFontColor] = useState({ state: false, color: "" });
    const [isItHighlightColor, setIsItHighlightColor] = useState({ state: false, color: "" });

    const editorRef = useRef<HTMLDivElement>(null);

    const handleSelection = () => {
        const selection = document.getSelection();

        if (selection && selection.rangeCount && selection.toString().length !== 0) {
            const range = selection.getRangeAt(0);
            const nodes = textNodesOfSelection(range.startContainer, range.endContainer);

            setIsItB(nodes.every(item => doesNodeHaveAncestor(item, "B")));
            setIsItI(nodes.every(item => doesNodeHaveAncestor(item, "I")));
            setIsItU(nodes.every(item => doesNodeHaveAncestor(item, "U")));
            setIsItS(nodes.every(item => doesNodeHaveAncestor(item, "S")));
            setIsItSup(nodes.every(item => doesNodeHaveAncestor(item, "SUP")));
            setIsItSub(nodes.every(item => doesNodeHaveAncestor(item, "SUB")));

            if (ancestorOfNode(range.startContainer, "SPAN", "font-color") === ancestorOfNode(range.endContainer, "SPAN", "font-color")) {
                setIsItFontColor({
                    state: true,
                    color: ancestorOfNode(range.startContainer, "SPAN", "font-color").style.color
                });
            }
            if (ancestorOfNode(range.startContainer, "SPAN", "bg-color") === ancestorOfNode(range.endContainer, "SPAN", "bg-color")) {
                setIsItHighlightColor({
                    state: true,
                    color: ancestorOfNode(range.startContainer, "SPAN", "bg-color").style.backgroundColor
                });
            }

        } else {
            reformatText();
            setIsItB(false);
            setIsItI(false);
            setIsItU(false);
            setIsItS(false);
            setIsItSup(false);
            setIsItSub(false);

            setIsItFontColor({
                state: false,
                color: ""
            });

            setIsItHighlightColor({
                state: false,
                color: ""
            });
        };
    }

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === "Enter") {
            event.preventDefault();
            insertText(`\n`);
        } else if (event.key === "Tab") {
            event.preventDefault();
            insertText(`\t`);
        }
    }

    const applyFormatting = (formatting: string) => {
        const selection = document.getSelection();

        if (selection && selection.rangeCount && selection.toString().length !== 0) {
            const range = selection.getRangeAt(0);
            const nodes = textNodesOfSelection(range.startContainer, range.endContainer);

            const selectionFrag = range.cloneContents();
            const formatNode = document.createElement(formatting);

            if (nodes.every(item => !doesNodeHaveAncestor(item, formatting))) {
                formatNode.appendChild(selectionFrag);

                range.deleteContents();
                range.insertNode(formatNode);
                range.selectNode(formatNode);

                selection.removeAllRanges();
                selection.addRange(range);

            } else if (!nodes.every(item => doesNodeHaveAncestor(item, formatting))) {
                removeStyleTag(selectionFrag, formatting);
                formatNode.appendChild(selectionFrag);

                range.deleteContents();
                range.insertNode(formatNode);
                range.selectNode(formatNode);

                selection.removeAllRanges();
                selection.addRange(range);
            }
        }
    }

    const removeFormatting = (formatting: string) => {
        const selection = document.getSelection();
        const tagsToReapply: string[] = [];
        const detectedStyles = {
            B: isItB,
            I: isItI,
            U: isItU,
            S: isItS,
            SUP: isItSup,
            SUB: isItSub
        }

        detectedStyles[formatting as keyof typeof detectedStyles] = false;

        for (let key in detectedStyles) {
            if (detectedStyles[key as keyof typeof detectedStyles]) {
                tagsToReapply.push(key.toString());
            }
        }

        if (selection && selection.rangeCount && selection.toString().length !== 0) {
            const range = selection.getRangeAt(0);
            const nodes = textNodesOfSelection(range.startContainer, range.endContainer);

            if (nodes.every(item => doesNodeHaveAncestor(item, formatting))) {
                const startNode = range.startContainer;
                const endNode = range.endContainer;
                const startOffset = range.startOffset;
                const endOffset = range.endOffset;
                const startAncestor = topAncestorOfNode(range.startContainer);
                const endAncestor = topAncestorOfNode(range.endContainer);

                let selectionFrag: DocumentFragment | HTMLElement;

                selectionFrag = range.cloneContents();

                removeStyleTag(selectionFrag, formatting);

                tagsToReapply.forEach(item => {
                    selectionFrag = surroundWithStyleTag(selectionFrag, item);
                });

                if (isItFontColor.state) {
                    const tempFrag = selectionFrag;

                    selectionFrag = document.createElement("SPAN");
                    selectionFrag.className = "font-color";
                    selectionFrag.appendChild(tempFrag);
                    selectionFrag.style.color = isItFontColor.color;
                }

                if (isItHighlightColor.state) {
                    const tempFrag = selectionFrag;

                    selectionFrag = document.createElement("SPAN");
                    selectionFrag.className = "bg-color";
                    selectionFrag.appendChild(tempFrag);
                    selectionFrag.style.backgroundColor = isItHighlightColor.color;
                }

                range.setStartBefore(startAncestor);
                range.setEnd(startNode, startOffset);
                const startFrag = range.cloneContents();

                range.setEndAfter(endAncestor);
                range.setStart(endNode, endOffset);
                const endFrag = range.cloneContents();

                range.setStartBefore(startAncestor);
                range.setEndAfter(endAncestor);
                range.deleteContents();

                range.insertNode(startFrag);
                range.collapse(false);
                range.insertNode(endFrag);
                range.collapse(true);
                range.insertNode(selectionFrag);

                selection.removeAllRanges();
                selection.addRange(range);
            }
        }
    }

    const removeAllFormatting = () => {
        const selection = document.getSelection();

        if (selection && selection.rangeCount && selection.toString().length !== 0) {
            const range = selection.getRangeAt(0);

            const startNode = range.startContainer;
            const endNode = range.endContainer;
            const startOffset = range.startOffset;
            const endOffset = range.endOffset;
            const startAncestor = topAncestorOfNode(range.startContainer);
            const endAncestor = topAncestorOfNode(range.endContainer);

            const selectionFrag = range.cloneContents();

            const nodeTags = ["B", "I", "U", "S", "SUP", "SUB"];

            nodeTags.forEach(tag => removeStyleTag(selectionFrag, tag));

            removeSpanTag(selectionFrag, "font-color");
            removeSpanTag(selectionFrag, "bg-color");

            if (startAncestor === startNode && endAncestor === endNode) {
                range.deleteContents();
                range.insertNode(selectionFrag);

                selection.removeAllRanges();
                selection.addRange(range);

            } else if (startAncestor !== startNode && endAncestor === endNode) {
                range.setStartBefore(startAncestor);
                range.setEnd(startNode, startOffset);
                const startFrag = range.cloneContents();

                range.setEnd(endNode, endOffset);
                range.deleteContents();

                range.insertNode(startFrag);
                range.collapse(false);
                range.insertNode(selectionFrag);

                selection.removeAllRanges();
                selection.addRange(range);

            } else if (startAncestor === startNode && endAncestor !== endNode) {
                range.setEndAfter(endAncestor);
                range.setStart(endNode, endOffset);
                const endFrag = range.cloneContents();

                range.setStart(startNode, startOffset);
                range.deleteContents();

                range.insertNode(endFrag);
                range.collapse(true);
                range.insertNode(selectionFrag);

                selection.removeAllRanges();
                selection.addRange(range);

            } else if (startAncestor !== startNode && endAncestor !== endNode) {
                range.setStartBefore(startAncestor);
                range.setEnd(startNode, startOffset);
                const startFrag = range.cloneContents();

                range.setEndAfter(endAncestor);
                range.setStart(endNode, endOffset);
                const endFrag = range.cloneContents();

                range.setStartBefore(startAncestor);
                range.setEndAfter(endAncestor);
                range.deleteContents();

                range.insertNode(startFrag);
                range.collapse(false);
                range.insertNode(endFrag);
                range.collapse(true);
                range.insertNode(selectionFrag);

                selection.removeAllRanges();
                selection.addRange(range);
            }
        }
    }

    const applyColor = (className: string) => {
        const selection = document.getSelection();

        if (selection && selection.rangeCount && selection.toString().length !== 0) {
            const range = selection.getRangeAt(0);
            const selectionFrag = range.cloneContents();
            const spanNode = document.createElement("SPAN");

            spanNode.className = className;

            if (className === "font-color") spanNode.style.color = fontColor;
            if (className === "bg-color") spanNode.style.backgroundColor = highlightColor;

            removeSpanTag(selectionFrag, className);

            spanNode.appendChild(selectionFrag);

            range.deleteContents();
            range.insertNode(spanNode);
            range.selectNode(spanNode);

            selection.removeAllRanges();
            selection.addRange(range);
        }
    }

    const reformatText = () => {
        const nodeTags = ["B", "I", "U", "S", "SUP", "SUB"];

        if (editorRef.current) {

            if (editorRef.current.lastChild && editorRef.current.lastChild.nodeName !== "BR") {
                editorRef.current.append(document.createElement("BR"));
            }

            nodeTags.forEach(tag => {
                editorRef.current && removeDoubleFormatting(editorRef.current, tag);
                editorRef.current && mergeSiblings(editorRef.current, tag);
            });

            removeChildlessNodes(editorRef.current);
            editorRef.current.normalize();
        }
    }

    return (
        <>
            <header>
                <Toolbar
                    isItB={isItB}
                    isItI={isItI}
                    isItU={isItU}
                    isItS={isItS}
                    isItSup={isItSup}
                    isItSub={isItSub}
                    applyFormatting={applyFormatting}
                    removeFormatting={removeFormatting}
                    removeAllFormatting={removeAllFormatting}
                    fontColorPickerActive={fontColorPickerActive}
                    setFontColorPickerActive={setFontColorPickerActive}
                    highlightColorPickerActive={highlightColorPickerActive}
                    setHighlightColorPickerActive={setHighlightColorPickerActive}
                    applyFontColor={() => applyColor("font-color")}
                    applyHighlightColor={() => applyColor("bg-color")}
                    fontColor={fontColor}
                    setFontColor={setFontColor}
                    highlightColor={highlightColor}
                    setHighlightColor={setHighlightColor}
                />
                <p id="logo">WYSIWYG Editor<br /><span>© {new Date().getFullYear()} Akos Varga, aka 30isnottoolate</span></p>
            </header>
            <div
                id="editor-container"
                onMouseDown={() => {
                    setFontColorPickerActive(false);
                    setHighlightColorPickerActive(false);
                }}>
                <div
                    id="editor"
                    ref={editorRef}
                    spellCheck={false}
                    contentEditable={true}
                    suppressContentEditableWarning={true}
                    onInput={reformatText}
                    onKeyDown={event => handleKeyDown(event)}
                    onSelect={handleSelection} >
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et 
                    dolore magna aliqua. In est ante in nibh mauris cursus mattis molestie. Eu facilisis sed odio morbi quis 
                    commodo odio aenean. Amet massa vitae tortor condimentum. Amet porttitor eget dolor morbi non arcu risus 
                    quis. Lectus proin nibh nisl condimentum id venenatis a condimentum vitae. Sit amet volutpat consequat 
                    mauris nunc. Sed viverra ipsum nunc aliquet. Nisl nisi scelerisque eu ultrices vitae auctor. Metus 
                    aliquam eleifend mi in nulla posuere sollicitudin. Sit amet consectetur adipiscing elit duis. Vel quam 
                    elementum pulvinar etiam non. Lorem dolor sed viverra ipsum nunc aliquet bibendum. Sapien nec sagittis 
                    aliquam malesuada bibendum arcu vitae.<br/><br/>
                    Malesuada bibendum arcu vitae elementum curabitur vitae nunc sed velit. Nunc sed augue lacus viverra 
                    vitae. Consectetur adipiscing elit duis tristique sollicitudin nibh sit amet commodo. Mollis nunc sed 
                    id semper risus. Lorem ipsum dolor sit amet consectetur adipiscing elit. Dictumst vestibulum rhoncus est 
                    pellentesque elit ullamcorper dignissim cras tincidunt. Faucibus vitae aliquet nec ullamcorper sit amet 
                    risus nullam. Vel eros donec ac odio tempor orci. Sagittis orci a scelerisque purus semper eget. Eros in 
                    cursus turpis massa tincidunt dui ut ornare. A diam maecenas sed enim ut sem. Dictum fusce ut placerat 
                    orci nulla pellentesque dignissim enim sit. Arcu ac tortor dignissim convallis aenean et tortor. Amet 
                    nulla facilisi morbi tempus iaculis urna id volutpat lacus.<br/><br/>
                    Volutpat blandit aliquam etiam erat velit scelerisque in dictum non. Non sodales neque sodales ut etiam 
                    sit. Vitae turpis massa sed elementum tempus egestas sed sed risus. Orci nulla pellentesque dignissim 
                    enim sit amet. Mauris commodo quis imperdiet massa tincidunt. Id velit ut tortor pretium viverra. Blandit 
                    aliquam etiam erat velit scelerisque in dictum. Tellus in metus vulputate eu scelerisque felis imperdiet. 
                    Morbi blandit cursus risus at ultrices. Faucibus in ornare quam viverra orci sagittis eu. Aliquet porttitor 
                    lacus luctus accumsan tortor posuere ac ut. Congue quisque egestas diam in. Tristique nulla aliquet enim 
                    tortor at auctor. In massa tempor nec feugiat nisl pretium fusce id velit. Elementum nisi quis eleifend 
                    quam adipiscing. Duis tristique sollicitudin nibh sit amet commodo nulla facilisi nullam. Lectus magna 
                    fringilla urna porttitor. Quis imperdiet massa tincidunt nunc. Velit dignissim sodales ut eu sem integer 
                    vitae justo eget.<br/><br/>
                    Lobortis elementum nibh tellus molestie. Tortor id aliquet lectus proin nibh nisl condimentum. Pellentesque 
                    diam volutpat commodo sed egestas. Amet nulla facilisi morbi tempus iaculis urna id volutpat lacus. 
                    Sollicitudin aliquam ultrices sagittis orci a scelerisque. Sit amet consectetur adipiscing elit ut aliquam 
                    purus sit amet. Massa eget egestas purus viverra accumsan. Pharetra sit amet aliquam id diam maecenas 
                    ultricies mi eget. Feugiat vivamus at augue eget arcu dictum varius duis at. Erat nam at lectus urna duis 
                    convallis convallis tellus id. Id faucibus nisl tincidunt eget. Pharetra massa massa ultricies mi quis. 
                    Vestibulum lectus mauris ultrices eros in cursus turpis massa tincidunt. Morbi tempus iaculis urna id 
                    volutpat lacus.
                </div>
            </div>
        </>
    )
}

export default App;
