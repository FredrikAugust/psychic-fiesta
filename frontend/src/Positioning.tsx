import React, { useState } from 'react';
import ReactFlow, {
    Background,
    Elements,
    FlowExportObject,
    MiniMap,
    OnLoadParams,
    ReactFlowProvider,
    useZoomPanHelper,
} from 'react-flow-renderer';
import { Socket } from 'socket.io-client';

import styled from 'styled-components';
import { customNodeMap } from './Whiteboard';

const Container = styled.div`
    height: 100vh;
    display: flex;
    flex-direction: column;
`;

const Wrapper = styled.div`
    width: 100vw;

    flex-grow: 1;
`;

const Crosshair = styled.div`
    position: relative;

    bottom: 50%;

    z-index: 999;

    width: 100vw;
    display: flex;
    justify-content: center;
`;

type PositioningProps = {
    socket?: Socket;
    setIsPositioning: (isPositioning: boolean) => void;
    input: string;
    setInput: (input: string) => void;
};

const Positioning: React.FC<PositioningProps> = (props) => {
    const ref = React.useRef<HTMLDivElement>(null);

    const [instance, setInstance] = useState<OnLoadParams>();
    const [elements, setElements] = useState<Elements>([]);

    const { transform } = useZoomPanHelper();

    const getCoordinates = () => {
        if (!ref.current || !instance) return;

        const x = Math.round(window.innerWidth / 2);
        const y = Math.round(window.innerHeight / 2);

        const reactFlowBounds = ref.current.getBoundingClientRect();

        const coordinates = instance.project({
            x: x - reactFlowBounds.left,
            y: y - reactFlowBounds.top,
        });

        return coordinates;
    };

    const restoreFromString = (raw: string) => {
        try {
            const flow = JSON.parse(raw) as FlowExportObject;
            console.debug(flow);

            const [x = 0, y = 0] = flow.position;
            setElements(flow.elements);

            transform({ x, y, zoom: flow.zoom ?? 0 });

            return;
        } catch {
            // our code doesn't crash 😡

            return;
        }
    };

    React.useEffect(() => {
        props.socket?.send({ type: 'sync' });

        props.socket?.on('sync_response', (data) => {
            restoreFromString(data.value);
        });

        return () => {
            props.socket?.removeListener('sync_response');
        };
    }, []);

    return (
        <Container>
            <Wrapper ref={ref}>
                <ReactFlow nodeTypes={customNodeMap} draggable={false} onLoad={setInstance} elements={elements}>
                    <Background />
                    <MiniMap />
                </ReactFlow>
                <Crosshair>
                    <span>x</span>
                </Crosshair>
            </Wrapper>
            <button
                onClick={() => {
                    props.socket?.send({
                        type: 'create',
                        value: props.input,
                        position: getCoordinates(),
                    });
                    props.setIsPositioning(false);
                    props.setInput('');
                }}
            >
                Post it!
            </button>
            <button
                onClick={() => {
                    props.setIsPositioning(false);
                    props.setInput('');
                }}
            >
                cancel
            </button>
        </Container>
    );
};

const WrappedPositioning: React.FC<PositioningProps> = (props) => (
    <ReactFlowProvider>
        <Positioning {...props} />
    </ReactFlowProvider>
);

export default WrappedPositioning;
