import React, { useState } from "react";
import "./App.css";
import Toolbar from "./Toolbar";
import ColorPicker from "./ColorPicker";

const App: React.FC = () => {
    const [colorPickerActive, setColorPickerActive] = useState(false);
    const [fontColor, setFontColor] = useState("#ff0000");

    const applyFormatting = (style: string) => {
        const selection = window.getSelection();

        if (selection && selection.rangeCount && selection.toString().length !== 0) {
            const range = selection.getRangeAt(0);
            const formatNode = document.createElement(style);

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
        applyColor();
    }

    const applyColor = () => {
        const selection = window.getSelection();

        if (selection && selection.rangeCount && selection.toString().length !== 0) {
            const range = selection.getRangeAt(0);
            const colorNode = document.createElement("span");

            colorNode.style.color = fontColor;
            colorNode.appendChild(range.extractContents());

            range.deleteContents();
            range.insertNode(colorNode);
            range.selectNode(colorNode);

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

    return (
        <>
            <Toolbar
                applyFormatting={applyFormatting}
                removeAllFormatting={removeAllFormatting}
                applyFontColor={applyFontColor}
                fontColor={fontColor}
                setFontColor={setFontColor} />
            {/* <div className="toolbar">
                <button
                    className="tool"
                    title="Bold"
                    onClick={() => applyFormatting("b")}>
                    <b>B</b>
                </button>
                <button
                    className="tool italic"
                    title="Italic"
                    onClick={() => applyFormatting("i")}>
                    <i>I</i>
                </button>
                <button
                    className="tool"
                    title="Underline"
                    onClick={() => applyFormatting("u")}>
                    <u>U</u>
                </button>
                <button
                    className="tool"
                    title="Strikethrough"
                    onClick={() => applyFormatting("s")}>
                    <s>S</s>
                </button>
                <button
                    className="tool"
                    title="Superscript"
                    onClick={() => applyFormatting("sup")}>
                    A<sup>2</sup>
                </button>
                <button
                    className="tool"
                    title="Subscript"
                    onClick={() => applyFormatting("sub")}>
                    A<sub>2</sub>
                </button>
                <button
                    className="tool"
                    title="Remove All Formating"
                    onClick={() => removeAllFormatting()}>
                    X
                </button>
                <div
                    className="color-tool" >
                    <button
                        className="font-color"
                        title="Font Color"
                        onClick={() => applyFontColor()}
                        style={{ color: fontColor }}>
                        A
                    </button>
                    <button
                        className="tool-expander"
                        onClick={() => setColorPickerActive(prevState => !prevState)} >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="8"
                            height="8"
                            viewBox="-1 0 18 12" >
                            <polygon
                                points="0,0 8,10 16,0 8,10 0,0"
                                style={{ fill: "none", stroke: "#000000", strokeWidth: "3px" }}
                            />
                        </svg>
                    </button>
                    {colorPickerActive &&
                        <ColorPicker
                            setFontColor={setFontColor}
                            setColorPickerActive={setColorPickerActive}
                        />
                    }
                </div>
            </div> */}
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
                    nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure
                    dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur
                    sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                    <br />
                </div>
            </div>
        </>
    )
}

export default App;
