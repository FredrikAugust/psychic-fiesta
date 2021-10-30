import React from 'react';

import Container from './Container';

import socketIOClient, { Socket } from 'socket.io-client';
import Positioning from './Positioning';

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
        };
    }, []);

    const [input, setInput] = React.useState('');
    const [isPositioning, setIsPositioning] = React.useState(false);

    if (isPositioning) {
        return <Positioning socket={socket} />;
    }

    return (
        <Container>
            <h1>mobile</h1>

            <form
                action="#"
                onSubmit={(e) => {
                    e.preventDefault();
                    setInput('');
                    setIsPositioning(true);
                }}
            >
                <input type="text" value={input} onChange={(e) => setInput(e.currentTarget.value)} />
                <button type="submit">send</button>
            </form>
        </Container>
    );
};

export default App;
