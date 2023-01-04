import React from "react";

interface CustomColorSquareProps {
    color: string;
    customColorRef: React.RefObject<HTMLInputElement>;
    handleCustomColorSelection: (event: React.MouseEvent<HTMLDivElement>) => void;
    handleColorCustomization: (event: React.MouseEvent<HTMLDivElement>, customColorRef: React.RefObject<HTMLInputElement>) => void;
    setCustomColor: (index: number, value: string) => void;
}

const CustomColorSquare: React.FC<CustomColorSquareProps> = (
    {color, customColorRef, handleCustomColorSelection, handleColorCustomization, setCustomColor}: CustomColorSquareProps) => {

    return (
        <div
            className="color-square"
            style={{ backgroundColor: color }}
            onClick={(event: React.MouseEvent<HTMLDivElement>) => handleCustomColorSelection(event)}
            onContextMenu={(event: React.MouseEvent<HTMLDivElement>) => handleColorCustomization(event, customColorRef)} >
            <input
                ref={customColorRef}
                className="color-input"
                type="color"
                value={color}
                onChange={(event) => setCustomColor(0, event.currentTarget.value)}
            />
        </div>
    );
}

export default CustomColorSquare;
