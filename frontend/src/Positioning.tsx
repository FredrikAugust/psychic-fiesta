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
import { Colour } from './colors';
import { fadeIn, fadeOut } from './Container';
import { PostItInput } from './Mobile';
import { customNodeMap } from './Whiteboard';

const Container = styled.div`
    height: 100vh;
`;

const Buttons = styled.div`
    position: absolute;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: flex-end;
    justify-content: center;

    padding-bottom: 38px;

    button {
        -webkit-appearance: none;
        background: none;
        border: none;

        z-index: 99;
        cursor: pointer;

        &:not(:last-child) {
            margin-right: 12px;
            display: flex;
        }

        svg {
            height: 50px;
            width: 50px;
        }
    }
`;

const PostButton = styled.button`
    background-color: #545454 !important;
    color: white;

    height: 50px;

    border-radius: 31px;

    padding: 10px 30px;

    font-family: 'Cisco Sans', sans-serif;
    font-weight: lighter;
    font-size: 21px;

    letter-spacing: 1.5px;
`;

const Wrapper = styled.div`
    position: absolute;
    top: 0;

    width: 100vw;

    height: 100%;
`;

const Center = styled.div`
    position: absolute;

    height: 100%;
    width: 100%;

    display: flex;

    justify-content: center;
    align-items: center;

    textarea {
        width: 200px;

        z-index: 1;
    }
`;

type PositioningProps = {
    socket?: Socket;
    setIsPositioning: (isPositioning: boolean) => void;
    input: string;
    setInput: (input: string) => void;
    color: Colour;
};

const Positioning: React.FC<PositioningProps> = (props) => {
    const ref = React.useRef<HTMLDivElement>(null);
    const postitref = React.useRef<HTMLTextAreaElement>(null);

    const [instance, setInstance] = useState<OnLoadParams>();
    const [elements, setElements] = useState<Elements>([]);

    const { transform } = useZoomPanHelper();

    const getCoordinates = () => {
        if (!ref.current || !postitref.current || !instance) return;

        const x = Math.round(window.innerWidth / 2);
        const y = Math.round(window.innerHeight / 2);

        const reactFlowBounds = ref.current.getBoundingClientRect();

        const postitsize = postitref.current?.getBoundingClientRect();

        const coordinates = instance.project({
            x: x - reactFlowBounds.left - postitsize.width / 2,
            y: y - reactFlowBounds.top - postitsize.height / 2,
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

    const [animate, setAnimate] = useState(false);

    React.useEffect(() => {
        props.socket?.send({ type: 'sync' });

        setAnimate(true);

        props.socket?.on('sync_response', (data) => {
            restoreFromString(data.value);
        });

        return () => {
            props.socket?.removeListener('sync_response');
        };
    }, []);

    return (
        <>
            <Container>
                <Center>
                    <PostItInput
                        style={{ opacity: animate ? '1' : '0', transition: 'opacity 0.2s ease-in-out' }}
                        ref={postitref}
                        value="test"
                        readOnly
                        submitting={false}
                        color={props.color}
                    />
                </Center>
                <Wrapper ref={ref}>
                    <ReactFlow
                        zoomOnPinch={false}
                        zoomOnScroll={false}
                        nodeTypes={customNodeMap}
                        draggable={false}
                        onLoad={setInstance}
                        elements={elements}
                    >
                        <Background />
                        <MiniMap style={{ top: 10, right: 10, opacity: 0.5 }} />
                    </ReactFlow>
                </Wrapper>

                <Buttons>
                    <button
                        onClick={() => {
                            props.setIsPositioning(false);
                            props.setInput('');
                        }}
                    >
                        <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                            <title>common-actions/clear-active_32</title>
                            <path
                                d="M16 0c8.823 0 16 7.178 16 16 0 8.822-7.177 16-16 16-8.823 0-16-7.178-16-16C0 7.178 7.177 0 16 0zm5.8535 10.1465c-.195-.195-.512-.195-.707 0l-5.147 5.146-5.146-5.146c-.195-.195-.512-.195-.707 0-.195.195-.195.512 0 .707l5.146 5.147-5.146 5.146c-.195.195-.195.512 0 .707.098.098.226.147.353.147.128 0 .256-.049.354-.147l5.146-5.146 5.147 5.146c.098.098.226.147.353.147.128 0 .256-.049.354-.147.195-.195.195-.512 0-.707l-5.146-5.146 5.146-5.147c.195-.195.195-.512 0-.707z"
                                fill="#545454"
                                fillRule="evenodd"
                            />
                        </svg>
                    </button>
                    <PostButton
                        onClick={() => {
                            props.socket?.send({
                                type: 'create',
                                value: {
                                    position: getCoordinates(),
                                    value: props.input,
                                    color: props.color,
                                },
                            });
                            props.setIsPositioning(false);
                            props.setInput('');
                        }}
                    >
                        Post
                    </PostButton>
                </Buttons>
            </Container>
        </>
    );
};

const WrappedPositioning: React.FC<PositioningProps> = (props) => (
    <ReactFlowProvider>
        <Positioning {...props} />
    </ReactFlowProvider>
);

export default WrappedPositioning;
