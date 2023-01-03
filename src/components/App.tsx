import React, { useState, useRef, useEffect } from "react";
import "./App.css";
import ColorSquare from "./ColorSquare";

const DEFAULT_CUSTOM_COLORS =
    ["#000000", "#000000", "#000000", "#000000", "#000000",
        "#000000", "#000000", "#000000", "#000000", "#000000"];

const colors = ["#737373", "#ffffff", "#fca5a5", "#fdba74", "#fef08a", "#bef264", "#86efac", "#7dd3fc", "#d8b4fe", "#f0abfc", "#525252", "#f5f5f5", "#f87171", "#fb923c", "#facc15", "#a3e635", "#4ade80", "#38bdf8", "#c084fc", "#e879f9", "#404040", "#e5e5e5", "#ef4444", "#f97316", "#eab308", "#84cc16", "#22c55e", "#0ea5e9", "#a855f7", "#d946ef", "#262626", "#d4d4d4", "#b91c1c", "#ea580c", "#ca8a04", "#65a30d", "#15803d", "#0369a1", "#7e22ce", "#a21caf", "#000000", "#a3a3a3", "#7f1d1d", "#9a3412", "#713f12", "#3f6212", "#14532d", "#0c4a6e", "#581c87", "#701a75"];

const App: React.FC = () => {
    const [colorWindowActive, setColorWindowActive] = useState(false);
    const [fontColor, setFontColor] = useState("#ff0000");
    const [customColors, setCustomColors] = useState(() => {
        if (localStorage["customColors"] && localStorage["customColors"].split(",").length === 10) {
            return localStorage["customColors"].split(",");
        } else {
            localStorage["customColors"] = DEFAULT_CUSTOM_COLORS.toString();
            return DEFAULT_CUSTOM_COLORS;
        }
    });

    const customColorRef0 = useRef<HTMLInputElement>(null);
    const customColorRef1 = useRef<HTMLInputElement>(null);
    const customColorRef2 = useRef<HTMLInputElement>(null);
    const customColorRef3 = useRef<HTMLInputElement>(null);
    const customColorRef4 = useRef<HTMLInputElement>(null);
    const customColorRef5 = useRef<HTMLInputElement>(null);
    const customColorRef6 = useRef<HTMLInputElement>(null);
    const customColorRef7 = useRef<HTMLInputElement>(null);
    const customColorRef8 = useRef<HTMLInputElement>(null);
    const customColorRef9 = useRef<HTMLInputElement>(null);

    useEffect(() => {
        localStorage["customColors"] = customColors.toString();
    }, [customColors]);

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

    const setCustomColor = (index: number, color: string) => {
        const customColorArray = [...customColors];
        customColorArray[index] = color;
        setCustomColors(customColorArray);
    }

    const handleColorSelection = (event) => {
        setFontColor(event.currentTarget.style.backgroundColor);
        setColorWindowActive(false);
    }

    return (
        <>
            <div className="toolbar">
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
                <button
                    className="tool font-color"
                    title="Font Color"
                    onClick={() => applyColor()}
                    style={{ color: fontColor }}>
                    A
                </button>
                <div
                    className="color-tool" >
                    <button onClick={() => setColorWindowActive(true)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="9" height="9" viewBox="0 0 16 16">
                            <polygon points="0,0 8,10 16,0 8,10 0,0" style={{ fill: "none", stroke: "#000000", strokeWidth: "3px" }} />
                        </svg>
                    </button>

                    {colorWindowActive &&
                        <div className="colors-window">
                            <p>Color presets</p>
                            <div className="color-table">
                                {colors.map((item, index) => <ColorSquare key={index} clickHandler={handleColorSelection} color={item} />)}
                            </div>
                            <p>Custom colors</p>
                            <div className="custom-color-row">
                                <div
                                    className="color-square"
                                    style={{ backgroundColor: customColors[0] }}
                                    onDoubleClick={() => customColorRef0.current && customColorRef0.current.click()} >
                                    <input
                                        ref={customColorRef0}
                                        className="color-input"
                                        type="color"
                                        value={customColors[0]}
                                        onChange={(event) => setCustomColor(0, event.currentTarget.value)}
                                    />
                                </div>
                                <div
                                    className="color-square"
                                    style={{ backgroundColor: customColors[1] }}
                                    onDoubleClick={() => customColorRef1.current && customColorRef1.current.click()} >
                                    <input
                                        ref={customColorRef1}
                                        className="color-input"
                                        type="color"
                                        value={customColors[1]}
                                        onChange={(event) => setCustomColor(1, event.currentTarget.value)}
                                    />
                                </div>
                                <div
                                    className="color-square"
                                    style={{ backgroundColor: customColors[2] }}
                                    onDoubleClick={() => customColorRef2.current && customColorRef2.current.click()} >
                                    <input
                                        ref={customColorRef2}
                                        className="color-input"
                                        type="color"
                                        value={customColors[2]}
                                        onChange={(event) => setCustomColor(2, event.currentTarget.value)}
                                    />
                                </div>
                                <div
                                    className="color-square"
                                    style={{ backgroundColor: customColors[3] }}
                                    onDoubleClick={() => customColorRef3.current && customColorRef3.current.click()} >
                                    <input
                                        ref={customColorRef3}
                                        className="color-input"
                                        type="color"
                                        value={customColors[3]}
                                        onChange={(event) => setCustomColor(3, event.currentTarget.value)}
                                    />
                                </div>
                                <div
                                    className="color-square"
                                    style={{ backgroundColor: customColors[4] }}
                                    onDoubleClick={() => customColorRef4.current && customColorRef4.current.click()} >
                                    <input
                                        ref={customColorRef4}
                                        className="color-input"
                                        type="color"
                                        value={customColors[4]}
                                        onChange={(event) => setCustomColor(4, event.currentTarget.value)}
                                    />
                                </div>
                                <div
                                    className="color-square"
                                    style={{ backgroundColor: customColors[5] }}
                                    onDoubleClick={() => customColorRef5.current && customColorRef5.current.click()} >
                                    <input
                                        ref={customColorRef5}
                                        className="color-input"
                                        type="color"
                                        value={customColors[5]}
                                        onChange={(event) => setCustomColor(5, event.currentTarget.value)}
                                    />
                                </div>
                                <div
                                    className="color-square"
                                    style={{ backgroundColor: customColors[6] }}
                                    onDoubleClick={() => customColorRef6.current && customColorRef6.current.click()} >
                                    <input
                                        ref={customColorRef6}
                                        className="color-input"
                                        type="color"
                                        value={customColors[6]}
                                        onChange={(event) => setCustomColor(6, event.currentTarget.value)}
                                    />
                                </div>
                                <div
                                    className="color-square"
                                    style={{ backgroundColor: customColors[7] }}
                                    onDoubleClick={() => customColorRef7.current && customColorRef7.current.click()} >
                                    <input
                                        ref={customColorRef7}
                                        className="color-input"
                                        type="color"
                                        value={customColors[7]}
                                        onChange={(event) => setCustomColor(7, event.currentTarget.value)}
                                    />
                                </div>
                                <div
                                    className="color-square"
                                    style={{ backgroundColor: customColors[8] }}
                                    onDoubleClick={() => customColorRef8.current && customColorRef8.current.click()} >
                                    <input
                                        ref={customColorRef8}
                                        className="color-input"
                                        type="color"
                                        value={customColors[8]}
                                        onChange={(event) => setCustomColor(8, event.currentTarget.value)}
                                    />
                                </div>
                                <div
                                    className="color-square"
                                    style={{ backgroundColor: customColors[9] }}
                                    onDoubleClick={() => customColorRef9.current && customColorRef9.current.click()} >
                                    <input
                                        ref={customColorRef9}
                                        className="color-input"
                                        type="color"
                                        value={customColors[9]}
                                        onChange={(event) => setCustomColor(9, event.currentTarget.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    }
                </div>
                <button
                    className="tool"
                    title="Remove Color"
                    onClick={() => removeFormatting("SPAN")}>
                    X
                </button>
            </div>
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
            {/* <div className="window-container">
                
            </div> */}
        </>
    )
}

export default App;
