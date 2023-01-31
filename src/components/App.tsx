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

    const handleInput = (event: React.FormEvent<HTMLDivElement>) => {
        if (event.currentTarget.lastChild && event.currentTarget.lastChild.nodeName !== "BR") {
            event.currentTarget.append(document.createElement("BR"));
        }
        editorRef.current && editorRef.current.normalize();
        reformatText();
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

    const applyFontColor = () => {
        const selection = document.getSelection();

        if (selection && selection.rangeCount && selection.toString().length !== 0) {
            const range = selection.getRangeAt(0);
            const selectionFrag = range.cloneContents();
            const spanNode = document.createElement("SPAN");

            spanNode.style.color = fontColor;
            spanNode.className = "font-color"

            removeSpanTag(selectionFrag, "font-color");

            spanNode.appendChild(selectionFrag);

            range.deleteContents();
            range.insertNode(spanNode);
            range.selectNode(spanNode);

            selection.removeAllRanges();
            selection.addRange(range);
        }
    }

    const applyHighlightColor = () => {
        const selection = document.getSelection();

        if (selection && selection.rangeCount && selection.toString().length !== 0) {
            const range = selection.getRangeAt(0);
            const selectionFrag = range.cloneContents();
            const spanNode = document.createElement("SPAN");

            spanNode.style.backgroundColor = highlightColor;
            spanNode.className = "bg-color"

            removeSpanTag(selectionFrag, "bg-color");

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
                applyFontColor={applyFontColor}
                applyHighlightColor={applyHighlightColor}
                fontColor={fontColor}
                setFontColor={setFontColor}
                highlightColor={highlightColor}
                setHighlightColor={setHighlightColor}
            />
            <div id="editor-container">
                <div
                    id="editor"
                    ref={editorRef}
                    spellCheck={false}
                    contentEditable={true}
                    suppressContentEditableWarning={true}
                    onInput={event => handleInput(event)}
                    onKeyDown={event => handleKeyDown(event)}
                    onSelect={handleSelection} >
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                    sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
                    nostrud <b>exercitation ullamco </b><b className="123">laboris <b></b>nisi ut <i>aliquip <b><i>ex</i></b> ea commodo</i> consequat. Duis</b> aute irure
                    dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur
                    sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                    <br />
                </div>
            </div>
        </>
    )
}

export default App;
