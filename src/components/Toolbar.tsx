import React, { useState, useEffect } from "react";
import ColorPicker from "./ColorPicker";

interface ToolbarProps {
    isItB: boolean;
    isItI: boolean;
    isItU: boolean;
    isItS: boolean;
    isItSup: boolean;
    isItSub: boolean;
    applyFormatting: (formatting: string) => void;
    removeFormatting: (formatting: string) => void;
    removeAllFormatting: () => void;
    applyFontColor: () => void;
    fontColor: string;
    setFontColor: (color: string) => void;
    highlightColor: string;
    setHighlightColor: (color: string) => void;
}

const Toolbar: React.FC<ToolbarProps> = (
    { isItB, isItI, isItU, isItS, isItSup, isItSub, 
        applyFormatting, removeFormatting, removeAllFormatting, applyFontColor, 
        fontColor, setFontColor, highlightColor, setHighlightColor }: ToolbarProps) => {

    const [fontColorPickerActive, setFontColorPickerActive] = useState(false);
    const [highlightColorPickerActive, setHighlightColorPickerActive] = useState(false);

    return (
        <div className="toolbar">
            <button
                className={`tool ${isItB ? "highlighted" : ""}`}
                title="Bold"
                onClick={() => isItB ? removeFormatting("B") : applyFormatting("B")}>
                <b>B</b>
            </button>
            <button
                className={`tool italic ${isItI ? "highlighted" : ""}`}
                title="Italic"
                onClick={() => isItI ? removeFormatting("I") : applyFormatting("I")}>
                <i>I</i>
            </button>
            <button
                className={`tool ${isItU ? "highlighted" : ""}`}
                title="Underline"
                onClick={() => isItU ? removeFormatting("U") : applyFormatting("U")}>
                <u>U</u>
            </button>
            <button
                className={`tool ${isItS ? "highlighted" : ""}`}
                title="Strikethrough"
                onClick={() => isItS ? removeFormatting("S") : applyFormatting("S")}>
                <s>S</s>
            </button>
            <button
                className={`tool ${isItSup ? "highlighted" : ""}`}
                title="Superscript"
                onClick={() => isItSup ? removeFormatting("SUP") : applyFormatting("SUP")}>
                A<sup>2</sup>
            </button>
            <button
                className={`tool ${isItSub ? "highlighted" : ""}`}
                title="Subscript"
                onClick={() => isItSub ? removeFormatting("SUB") : applyFormatting("SUB")}>
                A<sub>2</sub>
            </button>
            <button
                className="tool"
                title="Remove All Formating"
                onClick={() => removeAllFormatting()}>
                R
            </button>
            <div
                className="color-tool" >
                <button
                    className="font-color-tool"
                    title="Font Color"
                    onClick={() => applyFontColor()}
                    style={{ color: fontColor }}>
                    A
                </button>
                <button
                    className="tool-expander"
                    onClick={() => {
                        setFontColorPickerActive(prevState => !prevState);
                        setHighlightColorPickerActive(false);
                    }} >
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
                {fontColorPickerActive &&
                    <ColorPicker
                        setFontColor={setFontColor}
                        setColorPickerActive={setFontColorPickerActive}
                    />
                }
            </div>
            <div
                className="color-tool" >
                <button
                    className="font-color-tool"
                    title="Highlight Color"
                    onClick={() => applyFontColor()}
                    style={{ backgroundColor: highlightColor }}>
                    A
                </button>
                <button
                    className="tool-expander"
                    onClick={() => {
                        setHighlightColorPickerActive(prevState => !prevState);
                        setFontColorPickerActive(false);
                    }} >
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
                {highlightColorPickerActive &&
                    <ColorPicker
                        setFontColor={setHighlightColor}
                        setColorPickerActive={setHighlightColorPickerActive}
                    />
                }
            </div>
        </div>
    );
}

export default Toolbar;