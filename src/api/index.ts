import { IApiError } from './types/base';

type IApiResponse<T> = {
    result: T;
};

type IApiInvokeValue = string | string[] | number | number[] | boolean;
type IApiInvokeProps = Record<string, IApiInvokeValue>;
type IApiResult<T> = IApiResponse<T> | { error: IApiError };
type ApiInvoker = <T>(method: string, props?: IApiInvokeProps) => Promise<T>;

let authKey: string;
export const setAuthKey = (_authKey: string): string => authKey = _authKey;

const local = ['0.0.0.0', '192.168.1.200', 'local.sights.velu.ga'];

const apiRequest: ApiInvoker = async<T>(method: string, props: IApiInvokeProps = {}): Promise<T> => {
    if (authKey) {
        props.authKey = authKey;
    }

    const domain = false && local.includes(window.location.hostname)
        ? 'http://local.sights.velu.ga:3800'
        : 'https://sights.velu.ga'

    return fetch(`${domain}/api/${method}`, {
        method: 'post',
        mode: 'cors',
        cache: 'no-cache',
        redirect: 'follow',
        referrer: 'no-referrer',
        body: JSON.stringify(props),
        headers: {
            'content-type': 'application/json; charset=utf-8',
        },
    })
        .then(res => res.json())
        .then((res: IApiResult<T>) => {
            if ('error' in res) {
                throw res.error;
            }

            return res.result;
        });
};

export const apiExecute = async<T>(code: string, props: IApiInvokeProps = {}): Promise<T> => apiRequest('execute', { code, ...props });

export { apiRequest };

import { account } from './blocks/account';
import { categories } from './blocks/categories';
import { cities } from './blocks/cities';
import { comments } from './blocks/comments';
import { feed } from './blocks/feed';
import { internal } from './blocks/internal';
import { map } from './blocks/map';
import { notifications } from './blocks/notifications';
import { photos } from './blocks/photos';
import { sights } from './blocks/sights';
import { tags } from './blocks/tags';
import { users } from './blocks/users';

const API = {
    account,
    categories,
    cities,
    comments,
    feed,
    internal,
    map,
    notifications,
    photos,
    sights,
    tags,
    users,
};

export default API;
