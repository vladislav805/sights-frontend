import './scss/reset.scss';
import './scss/common.scss';
import { createElement } from 'react';
import { hydrate } from 'react-dom';
import App from '../components/App/@client';
import { Routes } from '../routes';
import { LazyComponentType } from '../components/Lazy';
import { getRoute } from '../selectors/getRoute/getRoute';
import { AppState } from '../store';

declare global {
    interface Window {
        __PRELOADED_STATE__: AppState;
    }
}

const state = window.__PRELOADED_STATE__;

delete window.__PRELOADED_STATE__;

history.scrollRestoration = 'manual';

// eslint-disable-next-line @typescript-eslint/no-misused-promises
document.addEventListener('DOMContentLoaded', async () => {
    // Load module
    const route = getRoute(state);

    if (route && Routes[route]) {
        await (Routes[route].component as LazyComponentType).loader();
    }

    hydrate(createElement(App, { state }), document.getElementById('root'));
});
