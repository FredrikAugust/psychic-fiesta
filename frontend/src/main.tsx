import React from 'react';
import ReactDOM from 'react-dom';

import { Reset } from 'styled-reset';
import { DefaultTheme, ThemeProvider } from 'styled-components';
import { Router, Route, HashRouter } from 'react-router-dom';
import { createHashHistory } from 'history';
import Whiteboard from './Whiteboard';
import Mobile from './Mobile';

import './styles.css';

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
                <HashRouter>
                    <Route path="/" exact component={Whiteboard} />
                    <Route path="/mobile" component={Mobile} />
                </HashRouter>
            </>
        </ThemeProvider>
    </React.StrictMode>,
    document.getElementById('root'),
);
