import * as fs from 'fs';
import { IUser } from '../api/types/user';
import { IOpenGraphProps, renderOpenGraphTags } from './open-graph';
import { escapeHtml } from '../utils/escape-html';

let __cacheBaseTemplate: string;

const readBaseHtmlTemplate = () => __cacheBaseTemplate
    ? __cacheBaseTemplate
    : __cacheBaseTemplate = fs.readFileSync('public/index.html', {
        encoding: 'utf-8',
    });

export type IBaseRendererHtmlProps = {
    //content: string;
    user?: IUser | undefined;
    openGraph?: IOpenGraphProps;
    // initialStore: Partial<RootStore>;
};

type IPreloadedState = Partial<{
    user: IUser | undefined;
}>;

export const renderBaseHtml = (props: IBaseRendererHtmlProps): string => {
    let html = ``;

    const preloadedState: IPreloadedState = {};

    if (props.user) {
        preloadedState.user = props.user;
    }

    if (Object.keys(preloadedState).length) {
        const json = JSON.stringify(preloadedState)
            .replace(/</g, '\\u003c');
        html += `<script>window.__PRELOADED_STATE__ = ${json};</script>`;
    }

    let rootHtml = readBaseHtmlTemplate();

    if (props.openGraph) {
        const { html, raw } = renderOpenGraphTags(props.openGraph);
        rootHtml = rootHtml.replace('<!--og-->', html);

        if (raw.title) {
            rootHtml = rootHtml.replace(/<title>([^<]+)<\/title>/i, `<title>${escapeHtml(raw.title)}</title>`);
        }
    }

    // noinspection HtmlUnknownTarget
    return rootHtml
        .replace('<!--root-->', html + '<script src="/static/js/main.js"></script>')
        .replace('<!--head-->', '<link rel="stylesheet" href="/static/css/main.css" />');
};
