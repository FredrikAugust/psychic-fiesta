import React from 'react';

import Container from './Container';

import socketIOClient, { Socket } from 'socket.io-client';
import Positioning from './Positioning';
import styled from 'styled-components';
import ColorPicker from './ColorPicker';
import { Colour, colours } from './colors';

//
const SOCKET_IO_ENDPOINT = `http://localhost:4000`;

const Form = styled.form`
    display: flex;
    flex-direction: column;

    justify-content: space-around;
    height: 100%;
`;

export const PostItInput = styled.textarea<{ color: Colour; submitting: boolean }>`
    --webkit-appearance: none;

    resize: none;

    border-radius: 13px;
    aspect-ratio: 1/1;

    color: #545454;

    font-family: 'Cisco Sans', sans-serif;

    font-size: 36px;

    width: 100%;

    max-width: 500px;

    line-height: 50px;

    padding: 30px;

    border: unset;

    background-color: ${(props) => props.color};

    transition: background-color 0.3s ease-in-out;

    opacity: ${(props) => (props.submitting ? '0' : '1')};
    transition: background-color 0.2s ease-in-out, opacity 0.2s ease-in-out;
`;

const Button = styled.button`
    --webkit-appearance: none;

    padding: 15px;

    svg {
        width: 32px;
        height: 32px;

        color: white;

        fill: white;
    }

    line-height: 0;

    background: #545454;

    border: unset;

    border-radius: 50%;

    align-self: center;
`;

const Button2 = styled.button<{ submitting: boolean }>`
    --webkit-appearance: none;

    padding: 0px;

    svg {
        width: 53px;
        height: 53px;
    }

    line-height: 0;

    background: unset;

    border: unset;

    border-radius: 50%;

    align-self: center;

    margin-top: auto;

    opacity: ${(props) => (props.submitting ? '0' : '1')};
    transition: opacity 0.2s ease-in-out;
`;

const App: React.FC = () => {
    const [socket, setSocket] = React.useState<Socket>();

    React.useEffect(() => {
        const _socket = socketIOClient(SOCKET_IO_ENDPOINT);
        setSocket(_socket);

        _socket.on('connect', () => {
            console.log('connected');
        });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        _socket.on('message', (message: Record<string, any>) => {
            console.debug(message);
        });

        return () => {
            _socket.removeAllListeners();
            _socket.close();
        };
    }, []);

    const [input, setInput] = React.useState('');
    const [isPositioning, setIsPositioning] = React.useState(false);
    const [color, setColor] = React.useState<typeof colours[keyof typeof colours]>(colours.yellow);

    const [submitting, setSubmitting] = React.useState(false);

    React.useEffect(() => {
        const handler = () => {
            setIsPositioning(true);
            setSubmitting(false);
        };
        let timeout = -1;
        if (submitting) {
            timeout = setTimeout(handler, 300);
        }

        return () => clearTimeout(timeout);
    }, [submitting]);

    if (isPositioning) {
        return (
            <Positioning
                color={color}
                setInput={setInput}
                input={input}
                socket={socket}
                setIsPositioning={setIsPositioning}
            />
        );
    }

    return (
        <Container>
            <Form
                action="#"
                className={'note'}
                onSubmit={(e) => {
                    e.preventDefault();
                    setSubmitting(true);
                }}
            >
                <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                    <PostItInput
                        submitting={submitting}
                        color={color}
                        placeholder={"What's on your mind?"}
                        value={input}
                        onChange={(e) => setInput(e.currentTarget.value)}
                    />

                    <ColorPicker submitting={submitting} color={color} setColor={setColor} />
                </div>

                {/* <Button>
                    <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <title>content/pen_24</title>
                        <path
                            d="M22.1661 5.8708l-15.639 15.64-4.037-4.037 15.639-15.64c.537-.537 1.253-.833 2.016-.834l.004 0c.764.001 1.48.297 2.017.834 1.112 1.113 1.112 2.924 0 4.037zm-20.099 12.594l3.468 3.468-4.432.964.964-4.432zm20.806-17.338c-.751-.75-1.736-1.126-2.723-1.127l-.005 0c-.987.001-1.972.377-2.723 1.127l-15.974 15.974c-.091.09-.153.205-.179.33l-1.254 5.76c-.048.222.02.453.18.614.126.127.297.195.472.195.047 0 .095-.005.142-.015l5.76-1.254c.125-.026.24-.089.33-.178l15.974-15.975c1.503-1.503 1.503-3.948 0-5.451z"
                            fillRule="evenodd"
                        />
                    </svg>
                </Button> */}

                <Button2 type="submit" submitting={submitting}>
                    <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <title>navigation/arrow-circle-right_24</title>
                        <path
                            d="M0 12c0 6.627417 5.372583 12 12 12 6.627417 0 12-5.372583 12-12 0-6.627417-5.372583-12-12-12C5.372583 0 0 5.372583 0 12zm1 0C1 5.9248678 5.9248678 1 12 1c6.07513225 0 11 4.9248678 11 11 0 6.07513225-4.92486775 11-11 11-6.0751322 0-11-4.92486775-11-11zm14.5 0c0-.128-.049-.256-.146-.354l-4.5-4.5c-.196-.195-.512-.195-.708 0-.195.196-.195.512 0 .708L14.293 12l-4.147 4.146c-.195.196-.195.512 0 .708.196.195.512.195.708 0l4.5-4.5c.097-.098.146-.226.146-.354z"
                            fill="#000"
                            fillRule="evenodd"
                        />
                    </svg>
                </Button2>
            </Form>
        </Container>
    );
};

export default App;
