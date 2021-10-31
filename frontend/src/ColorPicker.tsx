import React from 'react';
import styled from 'styled-components';
import { Colour, colours } from './colors';

type Props = {
    color: Colour;
    setColor: (color: Colour) => void;

    submitting: boolean;
};

const Swatch = styled.div<{ submitting: boolean }>`
    padding: 10px;
    margin-top: 20px;
    border-radius: 27.5px;

    background-color: #545454;

    display: flex;

    width: min-content;

    div:not(:last-child) {
        margin-right: 16px;
    }

    opacity: ${(props) => (props.submitting ? '0' : '1')};
    transition: opacity 0.2s ease-in-out;
`;

const Color = styled.div<{ active: boolean; colour: Colour }>`
    width: 35px;
    height: 35px;

    background-color: ${(props) => props.colour};
    border: ${(props) => (props.active ? '5px solid #fff' : 'none')};

    border-radius: 50%;
`;

const ColorPicker: React.FC<Props> = (props) => {
    return (
        <Swatch submitting={props.submitting}>
            {Object.values(colours).map((color) => (
                <Color
                    onClick={() => props.setColor(color)}
                    key={color}
                    active={color === props.color}
                    colour={color}
                />
            ))}
        </Swatch>
    );
};

export default ColorPicker;
