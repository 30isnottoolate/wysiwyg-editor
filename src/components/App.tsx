import React, { useState, useRef } from "react";
import { isConditionalExpression } from "typescript";
import "./App.css";

const App: React.FC = () => {
    const [fontColor, setFontColor] = useState("#ff0000");

    const editorRef = useRef<HTMLDivElement>(null);

    const applyFormat = (format: string) => {
        const selection = window.getSelection();

        if (selection && selection.rangeCount) {
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

        if (selection && selection.rangeCount) {
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

        if (selection && selection.rangeCount) {
            const range = selection.getRangeAt(0);
            const newNode = document.createDocumentFragment();

            newNode.append(range.extractContents());

            const extractChildren = (node: ChildNode) => {
                if (node.hasChildNodes() && node.nodeName === "SPAN") {
                    let nodes: Node[] = [];

                    let frag = document.createDocumentFragment();

                    node.childNodes.forEach((childNode) => {
                        nodes.push(childNode);
                    });

                    node.replaceWith(...nodes);
                    //frag.append(...nodes);
                    //node.replaceWith(frag);
                }
            }

            const removeTag = (node: DocumentFragment) => {
                if (node.hasChildNodes()) {

                    node.childNodes.forEach((childNode) => {
                        //console.log(childNode);
                        extractChildren(childNode);
                    });

                    /* while (node.firstChild) {
                        node.removeChild(node.firstChild);
                    } */
                }
                
            }

            removeTag(newNode);
            //removeTag(newNode);

            range.insertNode(newNode);
            //range.selectNode(newNode);
            selection.removeAllRanges();
            selection.addRange(range);
        }
    }

    const insertEnter = () => {
        const selection = window.getSelection();

        if (selection && selection.rangeCount) {
            const range = selection.getRangeAt(0);
            const textNode = document.createTextNode(`\n\r`);

            range.deleteContents();
            range.insertNode(textNode);
            range.selectNode(textNode);

            range.collapse(false);

            selection.removeAllRanges();
            selection.addRange(range);
        }
    }

    const insertTab = () => {
        const selection = window.getSelection();

        if (selection && selection.rangeCount) {
            const range = selection.getRangeAt(0);
            const textNode = document.createTextNode(`\t`);

            range.deleteContents();
            range.insertNode(textNode);
            range.selectNode(textNode);

            range.collapse(false);

            selection.removeAllRanges();
            selection.addRange(range);
        }
    }

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => { ///////!!!
        if (event.key === "Enter") {
            event.preventDefault();
            insertEnter();
        } else if (event.key === "Tab") {
            event.preventDefault();
            insertTab();
        }
    }

    const applyColor = () => {
        const selection = window.getSelection();

        if (selection && selection.rangeCount) {
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
            <button onClick={() => applyFormat("b")}><b>B</b></button>
            <button onClick={() => applyFormat("i")}><i>I</i></button>
            <button onClick={() => applyFormat("u")}><u>U</u></button>
            <button onClick={() => removeFormat()}>X</button>
            <button onClick={() => applyColor()} style={{ color: fontColor }}>C</button>
            <input type="color" value={fontColor} onChange={(event) => setFontColor(event.currentTarget.value)} />
            <button onClick={() => removeFormatExperimental()}>rem</button>
            <div id="editor" ref={editorRef} contentEditable={true} suppressContentEditableWarning={true} onKeyDown={event => handleKeyDown(event)} style={{ whiteSpace: "pre-wrap" }} >
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
