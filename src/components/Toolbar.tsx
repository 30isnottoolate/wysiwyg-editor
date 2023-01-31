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
    fontColorPickerActive: boolean;
    setFontColorPickerActive: React.Dispatch<React.SetStateAction<boolean>>;
    highlightColorPickerActive: boolean;
    setHighlightColorPickerActive: React.Dispatch<React.SetStateAction<boolean>>;
    applyFontColor: () => void;
    applyHighlightColor: () => void;
    fontColor: string;
    setFontColor: React.Dispatch<React.SetStateAction<string>>;
    highlightColor: string;
    setHighlightColor: React.Dispatch<React.SetStateAction<string>>;
}

const Toolbar: React.FC<ToolbarProps> = (
    { isItB, isItI, isItU, isItS, isItSup, isItSub, applyFormatting, removeFormatting, removeAllFormatting,
        fontColorPickerActive, setFontColorPickerActive, highlightColorPickerActive, setHighlightColorPickerActive,
        applyFontColor, applyHighlightColor, fontColor, setFontColor, highlightColor, setHighlightColor }: ToolbarProps) => {

    return (
        <div
            className="toolbar" onMouseDown={() => {
                setFontColorPickerActive(false);
                setHighlightColorPickerActive(false);
            }}>
            {
                [{ title: "Bold",           state: isItB,       symbol: "B",    label: <b>B</b> },
                { title: "Italic",          state: isItI,       symbol: "I",    label: <i>I</i> },
                { title: "Underline",       state: isItU,       symbol: "U",    label: <u>U</u> },
                { title: "Strikethrough",   state: isItS,       symbol: "S",    label: <s>S</s> },
                { title: "Superscript",     state: isItSup,     symbol: "SUP",  label: <>A<sup>2</sup></> },
                { title: "Subscript",       state: isItSub,     symbol: "SUB",  label: <>A<sub>2</sub></> }]
                    .map((item, index) =>
                        <button
                            key={index}
                            className={`tool ${item.symbol === "I" && "italic"} ${item.state ? "highlighted" : ""}`}
                            title={item.title}
                            onClick={() => item.state ? removeFormatting(item.symbol) : applyFormatting(item.symbol)}>
                            {item.label}
                        </button>
                    )
            }
            <button
                className="tool"
                title="Remove All Formating"
                onClick={() => removeAllFormatting()}>
                R
            </button>
            <div
                className="color-tool-set" >
                <button
                    className="color-tool"
                    title="Font Color"
                    onClick={() => applyFontColor()}
                    style={{ color: fontColor }}>
                    A
                </button>
                <button
                    className="tool-expander"
                    onClick={() => {
                        setFontColorPickerActive((prevState: boolean) => !prevState);
                        setHighlightColorPickerActive(false);
                    }} >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="8"
                        height="8"
                        viewBox="-1 0 18 12"
                        style={{ transform: `rotate(${fontColorPickerActive ? 180 : 0}deg)` }} >
                        <polygon
                            points="0,0 8,10 16,0 8,10 0,0"
                            style={{ fill: "none", stroke: "#000000", strokeWidth: "3px" }}
                        />
                    </svg>
                </button>
                {fontColorPickerActive &&
                    <ColorPicker
                        setColor={setFontColor}
                        setColorPickerActive={setFontColorPickerActive}
                    />
                }
            </div>
            <div
                className="color-tool-set" >
                <button
                    className="color-tool"
                    title="Highlight Color"
                    onClick={() => applyHighlightColor()}
                    style={{ backgroundColor: highlightColor }}>
                    A
                </button>
                <button
                    className="tool-expander"
                    onClick={() => {
                        setHighlightColorPickerActive((prevState: boolean) => !prevState);
                        setFontColorPickerActive(false);
                    }} >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="8"
                        height="8"
                        viewBox="-1 0 18 12"
                        style={{ transform: `rotate(${highlightColorPickerActive ? 180 : 0}deg)` }} >
                        <polygon
                            points="0,0 8,10 16,0 8,10 0,0"
                            style={{ fill: "none", stroke: "#000000", strokeWidth: "3px" }}
                        />
                    </svg>
                </button>
                {highlightColorPickerActive &&
                    <ColorPicker
                        setColor={setHighlightColor}
                        setColorPickerActive={setHighlightColorPickerActive}
                    />
                }
            </div>
        </div>
    );
}

export default Toolbar;