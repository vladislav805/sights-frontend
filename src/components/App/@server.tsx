import * as React from 'react';
import { Provider } from 'react-redux';
import { AppState, createAppStore } from '../../store';
import BaseApp from './Base';
import { StaticRouter } from 'react-router';

export interface AppProps {
    state: {
        state: AppState;
        files: Record<string, string>;
        css: string[];
        js: string[];
    };
    url: string;
}

const App: React.FC<AppProps> = ({ url, state: { state, js, css } }: AppProps) => {
    const store = createAppStore(state);

    return (
        <Provider store={store}>
            <StaticRouter location={url}>
                <html lang="ru">
                    <head>
                        {css.map(file => (
                            <link rel="stylesheet" href={file} key={file} />
                        ))}

                        <title>ШРИ: React</title>

                        <meta name="viewport" content="width=device-width, initial-scale=1" />
                    </head>
                    <body>
                        <div id="root">
                            <BaseApp />
                        </div>

                        <script
                            dangerouslySetInnerHTML={{
                                __html: `window.__PRELOADED_STATE__=${JSON.stringify(store.getState()).replace(/</g, '\\u003c')}`,
                            }}
                        />

                        {js.map(file => (
                            <script src={file} key={file} defer />
                        ))}
                    </body>
                </html>
            </StaticRouter>
        </Provider>
    );
};

export default App;
