import React from 'react';

interface ColorSquareProps {
    clickHandler: (event: React.MouseEvent<HTMLDivElement>) => void;
    color: string;
}

const ColorSquare: React.FC<ColorSquareProps> = ({clickHandler, color}: ColorSquareProps) => {

    return (
        <div
            className="color-square"
            onClick={event => clickHandler(event)}
            style={{ backgroundColor: color }}
        />
    );
}

export default ColorSquare;
