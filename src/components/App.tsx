import React, { useState, useRef } from "react";
import { readBuilderProgram } from "typescript";
import "./App.css";
import Toolbar from "./Toolbar";

const App: React.FC = () => {
    const [fontColor, setFontColor] = useState("#ff0000");

    const editorRef = useRef<HTMLDivElement>(null);

    const applyFormatting = (formatting: string) => {
        const selection = window.getSelection();

        if (selection && selection.rangeCount && selection.toString().length !== 0) {
            const range = selection.getRangeAt(0);
            const formatNode = document.createElement(formatting);

            if (formatting === "span") {
                formatNode.style.color = fontColor;
            }

            formatNode.appendChild(range.extractContents());

            range.deleteContents();
            range.insertNode(formatNode);
            range.selectNode(formatNode);

            selection.removeAllRanges();
            selection.addRange(range);
        }
    }

    const applyFontColor = () => {
        removeFormatting("SPAN");
        applyFormatting("span");
    }

    const removeTag = (node: Node | ChildNode | DocumentFragment, tag: string) => {
        if (node.hasChildNodes()) {

            node.childNodes.forEach((childNode) => {
                if (childNode.nodeName === tag && childNode.hasChildNodes()) {
                    childNode.replaceWith(...childNode.childNodes);
                    removeTag(node, tag);
                } else if (childNode.nodeName === tag && !childNode.hasChildNodes()) {
                    node.removeChild(childNode);
                    removeTag(node, tag);
                } else if (childNode.hasChildNodes()) {
                    removeTag(childNode, tag);
                }
            });
        }
    }

    const removeDoubleFormatting = (node: Node, tag: string) => {
        if (node.hasChildNodes()) {
            node.childNodes.forEach(childNode => {
                if (childNode.nodeName === tag) {
                    removeTag(childNode, tag);
                } else {
                    removeDoubleFormatting(childNode, tag);
                }
            });
        }
    }

    const mergeSiblings = (node: Node, tag: string) => {
        if (node.hasChildNodes()) {
            node.childNodes.forEach(childNode => {
                if (childNode.nodeName === tag && childNode.lastChild &&
                    childNode.nextSibling && childNode.nextSibling.nodeName === tag &&
                    childNode.nextSibling.hasChildNodes()) {
                    childNode.lastChild.after(...childNode.nextSibling.childNodes);
                    mergeSiblings(node, tag);
                } else {
                    mergeSiblings(childNode, tag);
                }
            });
        }
    }

    const removeChildlessNodes = (node: Node) => {
        if (node.hasChildNodes()) {
            node.childNodes.forEach(childNode => {
                if (!childNode.hasChildNodes() &&
                    childNode.nodeName !== "#text" && childNode.nodeName !== "BR") {
                    node.removeChild(childNode);
                    removeChildlessNodes(node);
                } else {
                    removeChildlessNodes(childNode);
                }
            });
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

    const removeFormatting = (formatting: string) => {
        const selection = window.getSelection();

        if (selection && selection.rangeCount && selection.toString().length !== 0) {
            const range = selection.getRangeAt(0);
            const selectedFrag = document.createDocumentFragment();

            selectedFrag.append(range.extractContents());

            removeTag(selectedFrag, formatting);

            range.deleteContents();
            range.insertNode(selectedFrag);

            selection.removeAllRanges();
            selection.addRange(range);
        }
    }

    const removeAllFormatting = () => {
        const selection = window.getSelection();

        if (selection && selection.rangeCount && selection.toString().length !== 0) {
            const range = selection.getRangeAt(0);
            const selectedTextNode = document.createTextNode(range.toString());

            range.deleteContents();
            range.insertNode(selectedTextNode);
            range.selectNode(selectedTextNode);

            selection.removeAllRanges();
            selection.addRange(range);
        }
    }

    const insertText = (text: string) => {
        const selection = window.getSelection();

        if (selection && selection.rangeCount) {
            const range = selection.getRangeAt(0);
            const textNode = document.createTextNode(text);

            range.deleteContents();
            range.insertNode(textNode);
            range.selectNode(textNode);
            range.collapse(false);

            selection.removeAllRanges();
            selection.addRange(range);
        }
    }

    const handleInput = (event: React.FormEvent<HTMLDivElement>) => {
        if (event.currentTarget.lastChild && event.currentTarget.lastChild.nodeName !== "BR") {
            event.currentTarget.append(document.createElement("br"));
        }
        editorRef.current && editorRef.current.normalize();
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

    const breakSelectionParent = () => {
        const selection = window.getSelection();

        if (selection && selection.rangeCount && selection.toString().length !== 0) {
            const range = selection.getRangeAt(0);

            if (range.startContainer.parentNode && range.endContainer.parentNode &&
                range.startContainer.parentNode === range.endContainer.parentNode &&
                range.startContainer.parentNode.nodeName !== "DIV") {

                const parentNode = range.startContainer.parentNode;

                const startNode = range.startContainer;
                const endNode = range.endContainer;
                const startOffset = range.startOffset;
                const endOffset = range.endOffset;

                const selectionFrag = range.cloneContents();

                range.setStartBefore(parentNode);
                range.setEnd(startNode, startOffset);
                const startFrag = range.cloneContents();

                range.setEndAfter(parentNode);
                range.setStart(endNode, endOffset);
                const endFrag = range.cloneContents();

                range.selectNode(parentNode);
                range.deleteContents();

                range.insertNode(startFrag);
                range.collapse(false);
                range.insertNode(endFrag);
                range.collapse(true);
                range.insertNode(selectionFrag);

                selection.removeAllRanges();
                selection.addRange(range);

            } else console.log("different parent");
        }
    }

    const breakSelectionParent2 = () => {
        const selection = window.getSelection();

        if (selection && selection.rangeCount && selection.toString().length !== 0) {
            const range = selection.getRangeAt(0);

            if (range.startContainer.parentNode && range.endContainer.parentNode &&
                range.startContainer.parentNode !== range.endContainer.parentNode &&
                range.startContainer.parentNode.nodeName !== "DIV" && range.endContainer.parentNode.nodeName !== "DIV") {

                let parentNode: Node;

                const startNode = range.startContainer;
                const endNode = range.endContainer;
                const startOffset = range.startOffset;
                const endOffset = range.endOffset;

                const selectionFrag = range.cloneContents();

                if (range.startContainer.parentNode.contains(range.endContainer.parentNode)) {
                    parentNode = range.startContainer.parentNode;
                } else if (range.endContainer.parentNode.contains(range.startContainer.parentNode)) {
                    parentNode = range.endContainer.parentNode;
                } else return

                range.setStartBefore(parentNode);
                range.setEnd(startNode, startOffset);
                const startFrag = range.cloneContents();

                range.setEndAfter(parentNode);
                range.setStart(endNode, endOffset);
                const endFrag = range.cloneContents();

                range.selectNode(parentNode);
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

    const handleSelection = () => {
        /* const selection = window.getSelection();

        if (selection && selection.rangeCount && selection.toString().length !== 0) {
            const range = selection.getRangeAt(0);

        } */
    }

    return (
        <>
            <Toolbar
                applyFormatting={applyFormatting}
                removeAllFormatting={removeAllFormatting}
                applyFontColor={applyFontColor}
                fontColor={fontColor}
                setFontColor={setFontColor}
            />
            <button onClick={breakSelectionParent} title="Break Selection Parent (Selection is on the same level)">__1__</button>
            <button onClick={breakSelectionParent2} title="Break Selection Parent (Selection is on different levels">__2__</button>
            <button onClick={reformatText} title="Reformat Text">__3__</button>
            <div id="editor-container">
                <div
                    id="editor"
                    ref={editorRef}
                    spellCheck={false}
                    contentEditable={true}
                    suppressContentEditableWarning={true}
                    onKeyDown={event => handleKeyDown(event)}
                    onInput={event => handleInput(event)}
                    /* onMouseUp={handleSelection} */ >
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
