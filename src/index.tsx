import * as React from 'react';
import { render } from 'react-dom';
import './scss/reset.scss';
import './scss/theme.scss';
import './scss/root.scss';
import './scss/common.scss';
import { BrowserRouter } from 'react-router-dom';
import App from './components/App';
import { Provider } from 'react-redux';
import { store } from './redux';

render(
    <Provider store={store}>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </Provider>,
    document.getElementById('root'),
);
