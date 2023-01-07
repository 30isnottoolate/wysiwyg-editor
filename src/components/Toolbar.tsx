import React, { useState } from "react";
import ColorPicker from "./ColorPicker";

interface ToolbarProps {
    applyFormatting: (formatting: string) => void;
    removeAllFormatting: () => void;
    applyFontColor: () => void;
    fontColor: string;
    setFontColor: (color: string) => void;
}

const Toolbar: React.FC<ToolbarProps> = (
    { applyFormatting, removeAllFormatting, applyFontColor, fontColor, setFontColor }: ToolbarProps) => {

    const [colorPickerActive, setColorPickerActive] = useState(false);

    return (
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