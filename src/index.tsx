import * as React from 'react';
import * as ReactDOM from 'react-dom';
import './scss/common.scss';
import './scss/root.scss';
import './scss/theme.scss';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import App from './components/App';
import { store } from './redux';

ReactDOM.render(
    <Provider store={store}>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </Provider>,
    document.getElementById('root'),
);
