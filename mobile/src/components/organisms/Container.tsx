import styled from 'styled-components';

export default styled.main`
    padding-top: ${(props) => props.theme.padding.md};
    padding-bottom: ${(props) => props.theme.padding.sm};
    padding-left: ${(props) => props.theme.padding.sm};
    padding-right: ${(props) => props.theme.padding.sm};
`;
