/* eslint-disable react/display-name */
import React from 'react';

import ReactFlow, {
    Background,
    Controls,
    Node,
    NodeComponentProps,
    OnLoadParams,
    ReactFlowProvider,
} from 'react-flow-renderer';

import socketIOClient from 'socket.io-client';
import styled from 'styled-components';

const SOCKET_IO_ENDPOINT = `http://localhost:4000`;

type Message = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    value: any;
    type: string;
};

const Postit = styled.div`
    font-family: 'Helvetica', sans-serif;
    font-weight: semibold;

    padding: 1em;
    background: rgb(255, 215, 7);
    position: relative;
    aspect-ratio: 1.3/1;
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

export const customNodeMap: Record<string, React.FC<NodeComponentProps>> = {
    postit: (props) => <Postit>{props.data?.label}</Postit>,
};

const App: React.FC = () => {
    const [nodes, setNodes] = React.useState<Node[]>([]);
    const [instance, setInstance] = React.useState<OnLoadParams>();

    React.useEffect(() => {
        const _socket = socketIOClient(SOCKET_IO_ENDPOINT);

        _socket.on('connect', () => {
            console.log('connected');
        });

        _socket.on('message', (message: Message) => {
            console.log(message);

            if (message.type === 'created')
                setNodes((msgs) => [
                    {
                        type: 'postit',
                        data: { label: message.value.value },
                        id: message.value.id,
                        position: message.value.position,
                    },
                    ...msgs,
                ]);

            if (message.type === 'sync')
                _socket.send({ type: 'sync_response', value: JSON.stringify(instance?.toObject()) });
        });

        return () => {
            _socket.removeAllListeners();
        };
    }, []);

    return (
        <ReactFlow
            onLoad={setInstance}
            style={{
                width: '100vw',
                height: '100vh',
            }}
            elements={nodes}
            nodeTypes={customNodeMap}
        >
            <Controls />
            <Background />
        </ReactFlow>
    );
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default () => (
    <ReactFlowProvider>
        <App />
    </ReactFlowProvider>
);
