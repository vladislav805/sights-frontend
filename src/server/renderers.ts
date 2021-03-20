import * as fs from 'fs';
import { IUser } from '../api/types/user';
import { IOpenGraphProps, renderOpenGraphTags } from './open-graph';
import { escapeHtml } from '../utils/escape-html';

let cacheBaseTemplate: string;

const readBaseHtmlTemplate = (): string => {
    if (!cacheBaseTemplate) {
        cacheBaseTemplate = fs.readFileSync('public/index.html', {
            encoding: 'utf-8',
        });
    }

    return cacheBaseTemplate;
};

export type IBaseRendererHtmlProps = {
    // content: string;
    user?: IUser | undefined;
    openGraph?: IOpenGraphProps;
    // initialStore: Partial<RootStore>;
};

type IPreloadedState = Partial<{
    user: IUser | undefined;
}>;

export const renderBaseHtml = (props: IBaseRendererHtmlProps): string => {
    let html = '';

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

    // noinspection HtmlUnknownTarget
    let headHtml = '<link rel="stylesheet" href="/static/css/main.css" />';

    if (props.openGraph) {
        const tags = renderOpenGraphTags(props.openGraph);
        rootHtml = rootHtml.replace('<!--og-->', tags.html);

        if (tags.raw.title) {
            rootHtml = rootHtml.replace(/<title>([^<]+)<\/title>/i, `<title>${escapeHtml(tags.raw.title)}</title>`);
        }

        if (tags.raw.url) {
            headHtml += `\n<link rel="canonical" href="https://${process.env.DOMAIN_MAIN}${tags.raw.url}" />`;
        }
    }

    // noinspection HtmlUnknownTarget
    return rootHtml
        .replace('<!--root-->', `${html}<script src="/static/js/main.js"></script>`)
        .replace('<!--head-->', headHtml);
};
