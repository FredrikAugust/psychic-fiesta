import React from 'react';

import Container from './components/organisms/Container';

import socketIOClient, { Socket } from 'socket.io-client';

const SOCKET_IO_ENDPOINT = `http://localhost:4000`;

const App: React.FC = () => {
    const [socket, setSocket] = React.useState<Socket>();

    React.useEffect(() => {
        const _socket = socketIOClient(SOCKET_IO_ENDPOINT);
        setSocket(_socket);

        _socket.on('connect', () => {
            console.log('connected');
        });

        return () => {
            _socket.removeAllListeners();
        };
    }, []);

    const [input, setInput] = React.useState('');

    return (
        <Container>
            <h1>mobile</h1>

            <form
                action="#"
                onSubmit={(e) => {
                    e.preventDefault();
                    socket?.send({ value: input });
                    setInput('');
                }}
            >
                <input type="text" value={input} onChange={(e) => setInput(e.currentTarget.value)} />
                <button type="submit">send</button>
            </form>
        </Container>
    );
};

export default App;
