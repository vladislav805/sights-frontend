import * as React from 'react';
import { render } from 'react-dom';
import './scss/common.scss';
import { HashRouter } from 'react-router-dom';
import App from './components/App';
import { Provider } from 'react-redux';
import { store } from './session';

render(
    <Provider store={store}>
        <HashRouter>
            <App />
        </HashRouter>
    </Provider>,
    document.getElementById('root')
);
