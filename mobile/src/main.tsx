import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';
import { Reset } from 'styled-reset';
import { DefaultTheme, ThemeProvider } from 'styled-components';

const theme: DefaultTheme = {
    padding: {
        xs: '0.5rem',
        sm: '1rem',
        md: '2rem',
        lg: '4rem',
    },
};

ReactDOM.render(
    <React.StrictMode>
        <ThemeProvider theme={theme}>
            <>
                <Reset />
                <App />
            </>
        </ThemeProvider>
    </React.StrictMode>,
    document.getElementById('root'),
);
