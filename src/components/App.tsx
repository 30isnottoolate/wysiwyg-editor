import React, { useState, useRef } from "react";
import "./App.css";

const App: React.FC = () => {
    const [fontColor, setFontColor] = useState("#ff0000");

    const editorRef = useRef<HTMLDivElement>(null);

    const applyFormat = (format: string) => {
        const selection = window.getSelection();

        if (selection && selection.rangeCount && selection.toString().length !== 0) {
            const range = selection.getRangeAt(0);
            const formatNode = document.createElement(format);

            formatNode.appendChild(range.extractContents());
            range.insertNode(formatNode);
            range.selectNode(formatNode);
            selection.removeAllRanges();
            selection.addRange(range);
        }
    }

    const removeFormat = () => {
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

            const extractChildren = (node: ChildNode) => {
                let fragOfChildren = document.createDocumentFragment();
                fragOfChildren.append(...node.childNodes);

                return fragOfChildren;
            }

            const removeTag = (node: DocumentFragment) => {
                if (node.hasChildNodes()) {
                    let nodes: (ChildNode | DocumentFragment)[] = [];

                    node.childNodes.forEach((childNode) => {
                        if (childNode.hasChildNodes() && childNode.nodeName === "SPAN") {
                            nodes.push(extractChildren(childNode));
                        } else {
                            nodes.push(childNode);
                        }
                    });

                    while (node.firstChild) {
                        node.removeChild(node.firstChild);
                    }

                    node.append(...nodes);
                }
            }

            removeTag(selectedFrag);

            range.insertNode(selectedFrag);
            //range.selectNode(newNode);
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

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === "Enter") {
            event.preventDefault();
            insertText(`\n\r`);
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
                    onClick={() => applyFormat("b")}>
                    <b>B</b>
                </button>
                <button
                    className="tool"
                    onClick={() => applyFormat("i")}>
                    <i>I</i>
                </button>
                <button
                    className="tool"
                    onClick={() => applyFormat("u")}>
                    <u>U</u>
                </button>
                <button
                    className="tool"
                    onClick={() => removeFormat()}>
                    X
                </button>
                <button
                    className="tool"
                    onClick={() => applyColor()}
                    style={{ color: fontColor }}>
                    C
                </button>
                <input
                    className="tool"
                    type="color"
                    value={fontColor}
                    onChange={(event) => setFontColor(event.currentTarget.value)}
                />
                <button
                    className="tool"
                    onClick={() => removeFormatExperimental()}>
                    rem
                </button>
            </div>
            <div
                id="editor"
                ref={editorRef}
                spellCheck={false}
                contentEditable={true}
                suppressContentEditableWarning={true}
                onKeyDown={event => handleKeyDown(event)}
                style={{ whiteSpace: "pre-wrap" }} >
                Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
                nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure
                dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur
                sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </div>
        </div>
    )
}

export default App;
