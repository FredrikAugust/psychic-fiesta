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

const Postit = styled.div<{ color: string }>`
    --webkit-appearance: none;

    resize: none;

    border-radius: 13px;
    aspect-ratio: 1/1;

    width: 200px;

    color: #545454;

    font-family: 'Cisco Sans', sans-serif;

    font-size: 24px;

    overflow: hidden;
    text-overflow: ellipsis;
    word-wrap: break-word;

    padding: 25px;

    border: unset;

    background-color: ${(props) => props.color};
`;

export const customNodeMap: Record<string, React.FC<NodeComponentProps>> = {
    postit: (props) => (
        <Postit color={props.data.color}>
            <span>{props.data?.label}</span>
        </Postit>
    ),
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
            if (message.type === 'created') {
                console.debug(message.value.value.value);
                setNodes((msgs) => [
                    {
                        type: 'postit',
                        data: { label: message.value.value.value, color: message.value.value.color },
                        id: message.value.id,
                        position: message.value.value.position,
                    },
                    ...msgs,
                ]);
            }
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
            socket?.removeListener('sync_response');
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
