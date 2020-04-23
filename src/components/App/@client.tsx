import * as React from 'react';

import { BrowserRouter } from 'react-router-dom';
import { AppState } from '../../store';
import { Provider } from 'react-redux';
import { createStore } from '../../utils/createStore/createStore';
import BaseApp from './Base';

export interface AppProps {
    state: AppState;
}

const App = ({ state: AppProps }: AppProps) => {
    return (
        <Provider store={createStore(state)}>
            <BrowserRouter>
                <React.Suspense fallback={<h1>Loading</h1>}>
                    <BaseApp />
                </React.Suspense>
            </BrowserRouter>
        </Provider>
    );
}

export default App;
