import { IOpenGraphProps } from './open-graph';
import * as QueryString from 'querystring';
import { getStaticMapImageUri } from '../utils/getStaticMapImageUri';
import { apiRequestRpc } from './api-rpc';
import { ISight } from '../api/types/sight';
import { IApiList } from '../api/types/api';
import { IUser, Sex } from '../api/types/user';
import { pluralize } from '../utils';
import { ICollection } from '../api/types/collection';

const userAgentBots = [
    'telegrambot',
    'vkshare',
    'facebookexternalhit',
    'twitterbot',
];

export const isServiceParserByUserAgent = (ua: string): boolean => userAgentBots.includes(ua.toLowerCase());

type RouterItem = (props: {
    path: string;
    params: string[];
    query: QueryString.ParsedUrlQuery;
}) => Promise<IOpenGraphProps>;

const ogRoutes = new Map<RegExp, RouterItem>();

ogRoutes.set(/^\/$/, () => Promise.resolve({
    type: 'website',
    title: 'Неформальные достопримечательности',
    image: '',
    url: '/',
}));

ogRoutes.set(/^\/sight\/map$/, (props) => {
    const coords = (props.query.c as string ?? '0,0').split(',');
    const z = +props.query.z ?? 12;
    return Promise.resolve({
        type: 'website',
        title: 'Карта неформальных достопримечательностей',
        image: getStaticMapImageUri({
            width: 300,
            height: 300,
            lat: parseFloat(coords[0]),
            lng: parseFloat(coords[1]),
            zoom: z,
        }),
        url: '/sight/map',
    });
});

ogRoutes.set(/^\/sight\/(\d+)$/, async(props) => {
    const sightId = props.params[1];
    const sights = await apiRequestRpc<IApiList<ISight>>('sights.getById', { sightIds: sightId, fields: 'photo,author' });

    if (!sights.items.length) {
        return undefined;
    }

    const sight = sights.items[0];

    return {
        type: 'article',
        title: sight.title,
        description: sight.description,
        'article:published_time': new Date(sight.dateCreated * 1000).toISOString(),
        'article:modified_time': new Date(sight.dateUpdated * 1000).toISOString(),
        url: `/sight/${sight.sightId}`,
        image: sight.photo?.photoMax,
        'image:width': sight.photo?.width,
        'image:height': sight.photo?.height,
    };
});

ogRoutes.set(/^\/user\/(\d+|[A-Za-z0-9-]+)$/, async(props) => {
    const userId = props.params[1];
    const users = await apiRequestRpc<IUser[]>('users.get', {
        userIds: userId,
        fields: 'ava,city,followers',
    });

    if (!users.length) {
        return undefined;
    }

    const user = users[0];

    return {
        type: 'profile',
        'profile:first_name': user.firstName,
        'profile:last_name': user.lastName,
        'profile:username': user.login,
        'profile:gender': user.sex === Sex.FEMALE ? 'female' : 'male',
        title: `Профиль @${user.login}`,
        description: [
            `${user.firstName} ${user.lastName}`.trim(),
            user.city?.name,
            `${user.followers} ${pluralize(user.followers, {
                one: 'подписчик',
                some: 'подписчика',
                many: 'подписчиков'
            })}`,
        ].filter(Boolean).join(', '),
        url: `/user/${user.login}`,
        image: user.photo?.photoMax,
        'image:width': user.photo?.width,
        'image:height': user.photo?.height,
    };
});

ogRoutes.set(/^\/collections\/(\d+)$/, async(props) => {
    const ownerId = props.params[1];
    type Result = { u: IUser; c: number };
    const { u, c } = await apiRequestRpc<Result>('execute', {
        code: 'const i=+A.id,u=API.users.get({userIds:i,fields:"ava"})[0],c=API.collections.get({ownerId:i,count:1}).count;return{u,c};',
        id: ownerId,
    });

    if (!u) {
        return undefined;
    }

    return {
        type: 'article',
        title: `Коллекции @${u.login}`,
        description: `${c} ${pluralize(c, { one: 'коллекция', some: 'коллекции', many: 'коллекций' })}`,
        url: `/collections/${u.userId}`,
        image: u.photo?.photoMax,
        'image:width': u.photo?.width,
        'image:height': u.photo?.height,
    };
});

ogRoutes.set(/^\/collection\/(\d+)$/, async(props) => {
    const collectionId = props.params[1];
    type Result = { u: IUser; c: ICollection; n: number };
    const { u, c, n } = await apiRequestRpc<Result>('execute', {
        code: 'const i=+A.id,c=API.collections.getById({collectionId:i,fields:"collection_city"}),u=API.users.get({userIds:c.ownerId})[0],n=c.items.length;c.items=null;return{u,c,n};',
        id: collectionId,
    });

    if (!c) {
        return undefined;
    }

    return {
        type: 'article',
        title: `Коллекция «${c.title}»`,
        description: [
            `Автор: @${u.login}`,
            `${n} ${pluralize(n, { one: 'место', some: 'места', many: 'мест' })}`,
            c.city && c.city.name,
        ].filter(Boolean).join(', '),
        url: `/collection/${c.collectionId}`,
    };
});

ogRoutes.set(/^\/search\/(sights|collections|users)$/, async(props) => {
    const query = props.query.query as string;
    const type = props.params[1];

    const subject: Record<string, string> = {
        sights: 'достопримечательностей',
        collections: 'коллекций',
        users: 'пользователей',
    };

    return Promise.resolve({
        type: 'website',
        title: `Поиск ${subject[type]}${query ? ` по запросу «${query}»` : ''}`,
        url: props.path,
    });
});

export const getOpenGraphByPath = async(path: string, query: QueryString.ParsedUrlQuery): Promise<IOpenGraphProps> => {
    for (const [pattern, handler] of ogRoutes.entries()) {
        if (pattern.test(path)) {
            return handler({
                path,
                params: pattern.exec(path),
                query,
            });
        }
    }

    return null;
};

