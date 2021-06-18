import { escapeHtml } from '../utils/escape-html';

type OpenGraphType =
    | 'website'
    | 'profile'
    | 'book'
    | 'video.movie'
    | 'video.episode'
    | 'video.tv_show'
    | 'video.other'
    | 'article'
    | 'music.song'
    | 'music.album'
    | 'music.radio_station'
    | 'music.playlist';

type IOpenGraphImage = {
    url: string;
    width: number;
    height: number;
};

export type IOpenGraphProps = {
    title: string;
    type: OpenGraphType;
    image?: string | string[] | IOpenGraphImage | IOpenGraphImage[];
    url: string;
} & Partial<{
    audio: string;
    description: string;
    determiner: 'a' | 'an' | 'the' | '' | 'auto';
    locale: string;
    'locale:alternate': string;
    site_name: string;
    video: string;
}> & Partial<{
    'article:published_time': string;
    'article:modified_time': string;
    'article:author': string;
    'article:section': string;
    'article:tag': string;
    'profile:first_name': string;
    'profile:last_name': string;
    'profile:username': string;
    'profile:gender': 'male' | 'female';
    'image:width': number;
    'image:height': number;
}> & {
    // Обычные мета-теги
    // Сделано так чисто потому что его вклинивать некуда, а делать отдельный модуль
    // с таким же функционалом и запрашиванием данных - нерационально
    meta_description?: string;
};

type OpenGraphName = keyof IOpenGraphProps;

const renderOpenGraphItem = <K extends OpenGraphName>(name: K, value: IOpenGraphProps[K] | string): string => {
    // если массив строк или объекта image
    if (Array.isArray(value)) {
        return (value as string[]).map(val => renderOpenGraphItem(name, val)).join('\n');
    }

    // если строка
    if (typeof value === 'string') {
        const attr = name === 'meta_description'
            ? 'name="description"'
            : `property="og:${name}"`;

        return `<meta ${attr} content="${escapeHtml(value)}"/>`;
    }

    // иначе объект image
    return (['image:url', 'image:width', 'image:height'] as OpenGraphName[])
        .map(key => value && renderOpenGraphItem(key, (value as IOpenGraphImage)[key.substring(6) as keyof IOpenGraphImage]))
        .filter(Boolean)
        .join('\n');
};

export const renderOpenGraphTags = (raw: IOpenGraphProps): { raw: IOpenGraphProps; html: string } => ({
    raw,
    html: Object.entries(raw)
        .filter(([, value]) => value)
        .map(([name, value]: [OpenGraphName, string]) => renderOpenGraphItem(name, value))
        .join('\n'),
});
