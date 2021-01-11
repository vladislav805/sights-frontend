import { IOpenGraphProps } from './open-graph';
import * as QueryString from 'querystring';
import { getStaticMapImageUri } from '../utils/getStaticMapImageUri';
import { apiRequestRpc } from './api-rpc';
import { ISight } from '../api/types/sight';
import { IApiList } from '../api/types/api';
import { IUser, Sex } from '../api/types/user';
import { pluralize } from '../utils';

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

