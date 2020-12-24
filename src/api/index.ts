import * as Type from './types';
import * as API from './blocks';

type IApiInvokeValue = string | string[] | number | number[] | boolean;
type IApiInvokeProps = Record<string, IApiInvokeValue>;
type IApiResult<T> = Type.IApiResponse<T> | { error: Type.IApiError };
type ApiInvoker = <T>(method: string, props?: IApiInvokeProps) => Promise<T>;

const handleValue = (value: IApiInvokeValue): string => {
    if (Array.isArray(value)) {
        return value.join(',');
    }

    if (typeof value === 'boolean') {
        return String(+value);
    }

    return String(value);
};

const getFormData = (props: IApiInvokeProps) => {
    const fd = new FormData();
    for (const [k, v] of Object.entries(props)) {
        if (v !== undefined) {
            fd.append(k, handleValue(v));
        }
    }
    return fd;
};

let authKey: string;
export const setAuthKey = (_authKey: string): string => authKey = _authKey;

const apiNew: ApiInvoker = async<T>(method: string, props: IApiInvokeProps = {}): Promise<T> => {
    if (authKey) {
        props.authKey = authKey;
    }

    const domain = (window.location.hostname === '0.0.0.0' || window.location.hostname === '192.168.1.200')
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

const api: ApiInvoker = async<T>(method: string, props: IApiInvokeProps = {}): Promise<T> => {
    if (authKey) {
        props.authKey = authKey;
    }

    if (!('v' in props)) {
        props.v = 250;
    }

    const res = await fetch(`https://sights.vlad805.ru/api/v2/${method}`, {
        method: 'post',
        mode: 'cors',
        cache: 'no-cache',
        redirect: 'follow',
        referrer: 'no-referrer',
        body: getFormData(props),
    });

    const json: IApiResult<T> = await res.json() as IApiResult<T>;

    if ('error' in json) {
        throw json.error;
    }

    return json.result;
};

export const apiExecute = async<T>(code: string, props: IApiInvokeProps = {}): Promise<T> => apiNew('execute', { code, ...props });

export { api, apiNew };
export * from './types';
export default API;
