import React, { useState, useRef } from "react";
import "./App.css";
import Toolbar from "./Toolbar";

const App: React.FC = () => {
    const [fontColor, setFontColor] = useState("#ff0000");

    const [isItB, setIsItB] = useState(false);
    const [isItI, setIsItI] = useState(false);
    const [isItU, setIsItU] = useState(false);
    const [isItS, setIsItS] = useState(false);
    const [isItSup, setIsItSup] = useState(false);
    const [isItSub, setIsItSub] = useState(false);


    const editorRef = useRef<HTMLDivElement>(null);

    const applyFontColor = () => {
        const selection = window.getSelection();

        if (selection && selection.rangeCount && selection.toString().length !== 0) {
            const range = selection.getRangeAt(0);
            const selectionFrag = range.cloneContents();
            const spanNode = document.createElement("SPAN");

            spanNode.style.color = fontColor;

            removeTag(selectionFrag, "SPAN");

            spanNode.appendChild(selectionFrag);

            range.deleteContents();
            range.insertNode(spanNode);
            range.selectNode(spanNode);

            selection.removeAllRanges();
            selection.addRange(range);
        }
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
                //range.selectNode(formatNode);

                selection.removeAllRanges();
                selection.addRange(range);

            } else if (!nodes.every(item => doesNodeHaveAncestor(item, formatting))) {
                removeTag(selectionFrag, formatting);
                formatNode.appendChild(selectionFrag);

                range.deleteContents();
                range.insertNode(formatNode);

                selection.removeAllRanges();
                selection.addRange(range);
            }
        }
    }

    const removeFormatting = (formatting: string) => {
        const selection = document.getSelection();

        if (selection && selection.rangeCount && selection.toString().length !== 0) {
            const range = selection.getRangeAt(0);
            const nodes = textNodesOfSelection(range.startContainer, range.endContainer);

            const startNode = range.startContainer;
            const endNode = range.endContainer;
            const startOffset = range.startOffset;
            const endOffset = range.endOffset;
            const startParent = ancestorOfNode(range.startContainer, formatting);
            const endParent = ancestorOfNode(range.endContainer, formatting);

            const selectionFrag = range.cloneContents();

            if (nodes.every(item => doesNodeHaveAncestor(item, formatting))) {
                removeTag(selectionFrag, formatting);

                range.setStartBefore(startParent);
                range.setEnd(startNode, startOffset);
                const startFrag = range.cloneContents();

                range.setEndAfter(endParent);
                range.setStart(endNode, endOffset);
                const endFrag = range.cloneContents();

                range.setStartBefore(startParent);
                range.setEndAfter(endParent);
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
        const selection = window.getSelection();

        if (selection && selection.rangeCount && selection.toString().length !== 0) {
            const range = selection.getRangeAt(0);
            const nodes = textNodesOfSelection(range.startContainer, range.endContainer);

            setIsItB(nodes.every(item => doesNodeHaveAncestor(item, "B")));
            setIsItI(nodes.every(item => doesNodeHaveAncestor(item, "I")));
            setIsItU(nodes.every(item => doesNodeHaveAncestor(item, "U")));
            setIsItS(nodes.every(item => doesNodeHaveAncestor(item, "S")));
            setIsItSup(nodes.every(item => doesNodeHaveAncestor(item, "SUP")));
            setIsItSub(nodes.every(item => doesNodeHaveAncestor(item, "SUB")));

        } else {
            setIsItB(false);
            setIsItI(false);
            setIsItU(false);
            setIsItS(false);
            setIsItSup(false);
            setIsItSub(false);
        };
    }

    const ancestorOfNode = (node: Node, ancestorNodeName: string) => {
        let ancestor = node;

        const ancestorFinder = (node: Node, ancestorNodeName: string) => {
            if (node.parentNode) {
                if (node.parentNode.nodeName !== ancestorNodeName && node.parentNode.nodeName !== "DIV") {
                    ancestorFinder(node.parentNode, ancestorNodeName);
                } else if (node.parentNode.nodeName === ancestorNodeName) {
                    ancestor = node.parentNode;
                } else if (node.parentNode.nodeName === "DIV") {
                    return;
                }
            }
        }

        ancestorFinder(node, ancestorNodeName);

        return ancestor;
    }

    const doesNodeHaveAncestor = (node: Node, ancestorNodeName: string) => {
        let answer = false;

        const ancestorFinder = (node: Node, ancestorNodeName: string) => {
            if (node.parentNode) {
                if (node.parentNode.nodeName !== ancestorNodeName && node.parentNode.nodeName !== "DIV") {
                    ancestorFinder(node.parentNode, ancestorNodeName);
                } else if (node.parentNode.nodeName === ancestorNodeName) {
                    answer = true;
                } else if (node.parentNode.nodeName === "DIV") {
                    answer = false;
                }
            }
        }

        ancestorFinder(node, ancestorNodeName);

        return answer;
    }

    const textNodesOfSelection = (startNode: Node, endNode: Node) => {
        const nodes: Node[] = [];

        const siblingsFinder = (startNode: Node, endNode: Node) => {
            if (startNode !== endNode) {
                if (startNode.nodeName === "#text") {
                    nodes.push(startNode);
                    if (startNode.nextSibling) {
                        siblingsFinder(startNode.nextSibling, endNode);
                    } else if (startNode.parentNode && startNode.parentNode.nextSibling) {
                        siblingsFinder(startNode.parentNode.nextSibling, endNode);
                    } else if (startNode.parentNode && !startNode.parentNode.nextSibling) {
                        siblingsFinder(getAncestorWithNextSibling(startNode.parentNode) || startNode.parentNode, endNode); // !!!
                    }
                } else {
                    if (startNode.firstChild) {
                        siblingsFinder(startNode.firstChild, endNode);
                    } else if (startNode.nextSibling) {
                        siblingsFinder(startNode.nextSibling, endNode);
                    }
                }
            } else {
                nodes.push(startNode);
            }
        }

        siblingsFinder(startNode, endNode);

        return nodes;
    }

    const getAncestorWithNextSibling = (node: Node) => {
        if (node.parentNode && node.parentNode.nodeName !== "DIV") {
            if (node.parentNode.nextSibling) {
                return node.parentNode.nextSibling;
            } else getAncestorWithNextSibling(node.parentNode);
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
                fontColor={fontColor}
                setFontColor={setFontColor}
            />
            <button onClick={reformatText} title="Reformat Text">__3__</button>
            <button onClick={() => {
                const selection = document.getSelection();
                const range = selection?.getRangeAt(0);
                console.log(range);
            }}>X</button>
            <div id="editor-container">
                <div
                    id="editor"
                    ref={editorRef}
                    spellCheck={false}
                    contentEditable={true}
                    suppressContentEditableWarning={true}
                    onKeyDown={event => handleKeyDown(event)}
                    onInput={event => handleInput(event)}
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
