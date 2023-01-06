import React, { useState } from "react";
import "./App.css";
import Toolbar from "./Toolbar";

const App: React.FC = () => {
    const [fontColor, setFontColor] = useState("#ff0000");

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
                if (childNode.hasChildNodes() && childNode.nodeName === tag) {
                    childNode.replaceWith(...childNode.childNodes);
                    removeTag(node, tag);
                } else if (childNode.hasChildNodes()) {
                    removeTag(childNode, tag);
                }
            });
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

        if (selection && selection.rangeCount) {
            const range = selection.getRangeAt(0);

            if (selection.focusNode?.parentNode === selection.anchorNode?.parentNode && selection.anchorNode?.parentNode?.nodeName !== "DIV") {

                const parentNode = selection.focusNode && selection.focusNode.parentNode;

                const focusNode = selection.focusNode;
                const anchorNode = selection.anchorNode;

                const focusOffset = selection.focusOffset;
                const anchorOffset = selection.anchorOffset;

                const selectionFrag = range.cloneContents();

                parentNode && range.setStartBefore(parentNode);
                focusNode && range.setEnd(focusNode, focusOffset);

                const startFrag = range.cloneContents();

                parentNode && range.setEndAfter(parentNode);
                anchorNode && range.setStart(anchorNode, anchorOffset);

                const endFrag = range.cloneContents();
                
                parentNode && range.setStartBefore(parentNode);
                parentNode && range.setEndAfter(parentNode);

                startFrag.append(selectionFrag);
                startFrag.append(endFrag);

                range.deleteContents();
                range.insertNode(startFrag);
                
                selection.removeAllRanges();
                //selection.addRange(range);

            } else console.log("different parent");
        }
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
            <button onClick={breakSelectionParent}>x</button>
            <div id="editor-container">
                <div
                    id="editor"
                    spellCheck={false}
                    contentEditable={true}
                    suppressContentEditableWarning={true}
                    onKeyDown={event => handleKeyDown(event)}
                    onInput={event => handleInput(event)} >
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                    sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
                    nostrud exercitation ullamco <b>laboris nisi ut <i>aliquip ex ea commodo</i> consequat. Duis</b> aute irure
                    dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur
                    sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                    <br />
                </div>
            </div>
        </>
    )
}

export default App;
