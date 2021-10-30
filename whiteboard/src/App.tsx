import React from 'react';

import ReactFlow, { Background, NodeComponentProps } from 'react-flow-renderer';

import socketIOClient, { Socket } from 'socket.io-client';
import styled from 'styled-components';

const SOCKET_IO_ENDPOINT = `http://localhost:4000`;

type Message = {
    id: string;
    value: string;
};

const Postit = styled.div`
    font-family: 'Helvetica', sans-serif;
    font-weight: semibold;

    padding: 1em;
    background: rgb(255, 215, 7);
    position: relative;
    aspect-ratio: 1.2/1;
    height: 80px;

    :after {
        content: '';
        position: absolute;
        bottom: -25px;
        left: 0;
        right: 25px;
        border-width: 15px;
        border-style: solid;
        border-color: rgb(255, 215, 7);
    }

    :before {
        content: '';
        position: absolute;
        bottom: -25px;
        right: 0;
        border-width: 25px 25px 0 0;
        border-style: solid;
        border-color: rgb(230, 190, 2) transparent; /*darken(rgb(255, 215, 7), 10%) transparent;*/
    }
`;

const customNodeMap: Record<string, React.FC<NodeComponentProps>> = {
    postit: (props) => <Postit>{props.data?.label}</Postit>,
};

const App: React.FC = () => {
    const [messages, setMessages] = React.useState<Message[]>([]);
    const [socket, setSocket] = React.useState<Socket>();

    React.useEffect(() => {
        const _socket = socketIOClient(SOCKET_IO_ENDPOINT);
        setSocket(_socket);

        _socket.on('connect', () => {
            console.log('connected');
        });

        _socket.on('message', (message: Message) => {
            setMessages((msgs) => [message, ...msgs]);
        });

        return () => {
            _socket.removeAllListeners();
        };
    }, []);

    return (
        <ReactFlow
            style={{
                width: '100vw',
                height: '100vh',
            }}
            elements={messages.map((message) => ({
                id: message.id,
                type: 'postit',
                position: { x: 0, y: 0 },
                data: { label: message.value },
            }))}
            nodeTypes={customNodeMap}
        >
            <Background />
        </ReactFlow>
    );
};

export default App;
