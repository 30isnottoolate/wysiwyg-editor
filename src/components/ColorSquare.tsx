import React from 'react';

interface ColorSquareProps {
    clickHandler: (event: React.MouseEvent) => void;
    bgColor: string;
}

const ColorSquare: React.FC<ColorSquareProps> = ({clickHandler, bgColor}: ColorSquareProps) => {

    return (
        <div
            className="color-square"
            onClick={event => clickHandler(event)}
            style={{ backgroundColor: bgColor }}
        />
    );
}

export default ColorSquare;
