/* eslint-disable react/display-name */
import React from 'react';

import ReactFlow, {
    Background,
    Controls,
    Elements,
    FlowExportObject,
    NodeComponentProps,
    OnLoadParams,
    ReactFlowProvider,
    useZoomPanHelper,
} from 'react-flow-renderer';

import socketIOClient, { Socket } from 'socket.io-client';
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
    const [nodes, setNodes] = React.useState<Elements>([]);
    const [instance, setInstance] = React.useState<OnLoadParams>();
    const [socket, setSocket] = React.useState<Socket>();

    const { transform } = useZoomPanHelper();

    React.useEffect(() => {
        const _socket = socketIOClient(SOCKET_IO_ENDPOINT);
        setSocket(_socket);

        _socket
            .on('connect', () => {
                console.log('Connected 🔋');

                _socket.send({ type: 'sync' });
            })
            .on('disconnect', () => {
                console.log('Disconnected 🔌');

                setNodes([]);
            });

        _socket.on('message', (message: Message) => {
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
        });

        return () => {
            _socket.removeAllListeners();
            _socket.close();
        };
    }, []);

    const restoreFromString = (raw: string) => {
        try {
            const flow = JSON.parse(raw) as FlowExportObject;

            const [x = 0, y = 0] = flow.position;
            setNodes(flow.elements);

            transform({ x, y, zoom: flow.zoom ?? 0 });

            return;
        } catch {
            // our code doesn't crash 😡

            return;
        }
    };

    React.useEffect(() => {
        socket?.on('sync', () => {
            socket?.send({ type: 'sync_response', value: JSON.stringify(instance?.toObject()) });
        });

        socket?.on('sync_response', (data) => {
            restoreFromString(data.value);
        });

        return () => {
            socket?.removeListener('sync');
        };
    }, [nodes, socket]);

    React.useEffect(() => {
        socket?.on('reset', () => {
            setNodes([]);
            console.debug('nodes reset');
        });

        return () => {
            socket?.removeListener('reset');
            socket?.removeListener('close');
        };
    }, [setNodes]);

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
