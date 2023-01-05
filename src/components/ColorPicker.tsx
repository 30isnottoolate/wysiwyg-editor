import React, { useState, useRef, useEffect } from "react";
import ColorSquare from "./ColorSquare";
import CustomColorSquare from "./CustomColorSquare";

const DEFAULT_CUSTOM_COLORS = [
    "#000000", "#000000", "#000000", "#000000", "#000000",
    "#000000", "#000000", "#000000", "#000000", "#000000"];

const colors = [
    "#737373", "#ffffff", "#fca5a5", "#fdba74", "#fef08a",
    "#bef264", "#86efac", "#7dd3fc", "#d8b4fe", "#f0abfc",
    "#525252", "#f5f5f5", "#f87171", "#fb923c", "#facc15",
    "#a3e635", "#4ade80", "#38bdf8", "#c084fc", "#e879f9",
    "#404040", "#e5e5e5", "#ef4444", "#f97316", "#eab308",
    "#84cc16", "#22c55e", "#0ea5e9", "#a855f7", "#d946ef",
    "#262626", "#d4d4d4", "#b91c1c", "#ea580c", "#ca8a04",
    "#65a30d", "#15803d", "#0369a1", "#7e22ce", "#a21caf",
    "#000000", "#a3a3a3", "#7f1d1d", "#9a3412", "#713f12",
    "#3f6212", "#14532d", "#0c4a6e", "#581c87", "#701a75"];

const customColorIndexes = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

interface ColorPickerProps {
    setFontColor: (color: string) => void;
    setColorPickerActive: (state: boolean) => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ setFontColor, setColorPickerActive }: ColorPickerProps) => {

    const [customColors, setCustomColors] = useState(() => {
        if (localStorage["customColors"] && localStorage["customColors"].split(",").length === 10) {
            return localStorage["customColors"].split(",");
        } else {
            localStorage["customColors"] = DEFAULT_CUSTOM_COLORS.toString();
            return DEFAULT_CUSTOM_COLORS;
        }
    });

    const customColorRefs = useRef<HTMLInputElement>(null);

    useEffect(() => {
        localStorage["customColors"] = customColors.toString();
    }, [customColors]);

    const setCustomColor = (index: number, color: string) => {
        const customColorArray = [...customColors];
        customColorArray[index] = color;
        setCustomColors(customColorArray);
    }

    const handleColorSelection = (event: React.MouseEvent<HTMLDivElement>) => {
        setFontColor(event.currentTarget.style.backgroundColor);
        setColorPickerActive(false);
    }

    const handleCustomColorSelection = (event: React.MouseEvent<HTMLDivElement>) => {
        if (event.detail === 1) {
            setFontColor(event.currentTarget.style.backgroundColor);
            setColorPickerActive(false);
        }
    }

    const handleColorCustomization = (event: React.MouseEvent<HTMLDivElement>, customColorRef: React.RefObject<HTMLInputElement>) => {
        event.preventDefault();
        customColorRef.current && customColorRef.current.click();
    }

    return (
        <div className="color-picker">
            <p>Color presets</p>
            <div className="color-table">
                {colors.map((item, index) => <ColorSquare key={index} clickHandler={handleColorSelection} color={item} />)}
            </div>
            <p>Custom colors</p>
            <div className="custom-color-row">
                {customColorIndexes.map((index) =>
                    <CustomColorSquare
                        key={index}
                        colors={customColors}
                        colorIndex={index}
                        customColorRef={customColorRefs.current && customColorRefs.current[index]}
                        handleCustomColorSelection={handleCustomColorSelection}
                        handleColorCustomization={handleColorCustomization}
                        setCustomColor={setCustomColor}
                    />)}
            </div>
        </div>
    );
}

export default ColorPicker;
