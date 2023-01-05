import React from "react";

interface CustomColorSquareProps {
    index: number;
    colors: string[];
    colorIndex: number;
    colorInputRefs: React.RefObject<HTMLInputElement[]>;
    handleCustomColorSelection: (event: React.MouseEvent<HTMLDivElement>) => void;
    handleColorCustomization: (event: React.MouseEvent<HTMLDivElement>, index: number) => void;
    setCustomColor: (index: number, value: string) => void;
}

const CustomColorSquare: React.FC<CustomColorSquareProps> = (
    { index, colors, colorIndex, colorInputRefs, handleCustomColorSelection, handleColorCustomization, setCustomColor }: CustomColorSquareProps) => {

    return (
        <div
            className="color-square"
            style={{ backgroundColor: colors[colorIndex] }}
            onClick={(event: React.MouseEvent<HTMLDivElement>) => handleCustomColorSelection(event)}
            onContextMenu={(event: React.MouseEvent<HTMLDivElement>) => handleColorCustomization(event, index)} >
            <input
                ref={(element: HTMLInputElement) => colorInputRefs.current && (colorInputRefs.current[index] = element)}
                className="color-input"
                type="color"
                value={colors[colorIndex]}
                onChange={(event) => setCustomColor(colorIndex, event.currentTarget.value)}
            />
        </div>
    );
}

export default CustomColorSquare;
