import styled, { keyframes } from 'styled-components';
export const fadeIn = keyframes`
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
`;

export const fadeOut = keyframes`
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
`;
export default styled.main`
    padding: ${(props) => props.theme.padding.md};
    padding-top: ${(props) => props.theme.padding.lg};
    padding-bottom: ${(props) => props.theme.padding.lg};
    height: 100%;
`;
