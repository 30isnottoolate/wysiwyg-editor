import React, { useState } from "react";
import "./App.css";

const App: React.FC = () => {
    const [fontColor, setFontColor] = useState("#ff0000");

    const applyStyle = (style: string) => {
        const selection = window.getSelection();

        if (selection && selection.rangeCount && selection.toString().length !== 0) {
            const range = selection.getRangeAt(0);
            const formatNode = document.createElement(style);

            formatNode.appendChild(range.extractContents());
            range.insertNode(formatNode);
            range.selectNode(formatNode);
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

    const removeFormatExperimental = () => {
        const selection = window.getSelection();

        if (selection && selection.rangeCount && selection.toString().length !== 0) {
            const range = selection.getRangeAt(0);
            const selectedFrag = document.createDocumentFragment();

            selectedFrag.append(range.extractContents());

            removeTag(selectedFrag, "SPAN");

            range.insertNode(selectedFrag);

            selection.removeAllRanges();
            selection.addRange(range);
        }
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

    const applyColor = () => {
        const selection = window.getSelection();

        if (selection && selection.rangeCount && selection.toString().length !== 0) {
            const range = selection.getRangeAt(0);
            const colorNode = document.createElement("span");

            colorNode.style.color = fontColor;
            colorNode.appendChild(range.extractContents());

            range.insertNode(colorNode);
            range.selectNode(colorNode);

            selection.removeAllRanges();
            selection.addRange(range);
        }
    }

    return (
        <div>
            <div className="toolbar">
                <button
                    className="tool"
                    title="Bold"
                    onClick={() => applyStyle("b")}>
                    <b>B</b>
                </button>
                <button
                    className="tool"
                    title="Italic"
                    onClick={() => applyStyle("i")}>
                    <i>I</i>
                </button>
                <button
                    className="tool"
                    title="Underline"
                    onClick={() => applyStyle("u")}>
                    <u>U</u>
                </button>
                <button
                    className="tool"
                    title="Remove All Formating"
                    onClick={() => removeAllFormatting()}>
                    X
                </button>
                <button
                    className="tool"
                    title="Color Font"
                    onClick={() => applyColor()}
                    style={{ color: fontColor }}>
                    A
                </button>
                <input
                    className="tool color-tool"
                    type="color"
                    value={fontColor}
                    onChange={(event) => setFontColor(event.currentTarget.value)}
                />
                <button
                    className="tool"
                    title="Remove Color"
                    onClick={() => removeFormatExperimental()}>
                    X
                </button>
            </div>
            <div
                id="editor"
                spellCheck={false}
                contentEditable={true}
                suppressContentEditableWarning={true}
                onKeyDown={event => handleKeyDown(event)}
                onInput={event => handleInput(event)} >
                Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
                nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure
                dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur
                sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                <br />
            </div>
        </div>
    )
}

export default App;
