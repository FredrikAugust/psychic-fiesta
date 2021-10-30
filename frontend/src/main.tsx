import React from 'react';
import ReactDOM from 'react-dom';

import { Reset } from 'styled-reset';
import { DefaultTheme, ThemeProvider } from 'styled-components';
import { Router, Route } from 'react-router-dom';
import { createBrowserHistory } from 'history';
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
                <Router history={createBrowserHistory()}>
                    <Route path="/" exact component={Whiteboard} />
                    <Route path="/mobile" component={Mobile} />
                </Router>
            </>
        </ThemeProvider>
    </React.StrictMode>,
    document.getElementById('root'),
);
