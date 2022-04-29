import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import './scss/common.scss';
import './scss/root.scss';
import './scss/theme.scss';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import App from './components/App';
import { store } from './redux';

const rootNode = document.getElementById('root');

const root = ReactDOM.createRoot(rootNode);

root.render(
    <Provider store={store}>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </Provider>,
);
