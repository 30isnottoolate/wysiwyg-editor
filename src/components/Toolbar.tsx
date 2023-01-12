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
}

const Toolbar: React.FC<ToolbarProps> = (
    { isItB, isItI, isItU, isItS, isItSup, isItSub, applyFormatting, removeFormatting, removeAllFormatting, applyFontColor, fontColor, setFontColor }: ToolbarProps) => {

    const [colorPickerActive, setColorPickerActive] = useState(false);

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
                onClick={() => applyFormatting("i")}>
                <i>I</i>
            </button>
            <button
                className={`tool ${isItU ? "highlighted" : ""}`}
                title="Underline"
                onClick={() => applyFormatting("u")}>
                <u>U</u>
            </button>
            <button
                className={`tool ${isItS ? "highlighted" : ""}`}
                title="Strikethrough"
                onClick={() => applyFormatting("s")}>
                <s>S</s>
            </button>
            <button
                className={`tool ${isItSup ? "highlighted" : ""}`}
                title="Superscript"
                onClick={() => applyFormatting("sup")}>
                A<sup>2</sup>
            </button>
            <button
                className={`tool ${isItSub ? "highlighted" : ""}`}
                title="Subscript"
                onClick={() => applyFormatting("sub")}>
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
        </div>
    );
}

export default Toolbar;