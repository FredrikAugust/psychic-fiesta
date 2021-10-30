import React from 'react';

import Container from './Container';

import socketIOClient, { Socket } from 'socket.io-client';
import Positioning from './Positioning';

//
const SOCKET_IO_ENDPOINT = `http://localhost:4000`;

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

    if (isPositioning) {
        return <Positioning setInput={setInput} input={input} socket={socket} setIsPositioning={setIsPositioning} />;
    }

    return (
        <Container>
            <form
                action="#"
                className={'note'}
                onSubmit={(e) => {
                    e.preventDefault();
                    setIsPositioning(true);
                }}
            >
                <textarea
                    className={'note__input'}
                    placeholder={'Write something clever, or not'}
                    value={input}
                    onChange={(e) => setInput(e.currentTarget.value)}
                />
                <button className={'note__submit'} type="submit">
                    <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <title>content/pen_24</title>
                        <path
                            d="M22.1661 5.8708l-15.639 15.64-4.037-4.037 15.639-15.64c.537-.537 1.253-.833 2.016-.834l.004 0c.764.001 1.48.297 2.017.834 1.112 1.113 1.112 2.924 0 4.037zm-20.099 12.594l3.468 3.468-4.432.964.964-4.432zm20.806-17.338c-.751-.75-1.736-1.126-2.723-1.127l-.005 0c-.987.001-1.972.377-2.723 1.127l-15.974 15.974c-.091.09-.153.205-.179.33l-1.254 5.76c-.048.222.02.453.18.614.126.127.297.195.472.195.047 0 .095-.005.142-.015l5.76-1.254c.125-.026.24-.089.33-.178l15.974-15.975c1.503-1.503 1.503-3.948 0-5.451z"
                            fillRule="evenodd"
                        />
                    </svg>
                </button>
            </form>
        </Container>
    );
};

export default App;
