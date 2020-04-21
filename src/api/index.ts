import * as Type from './types';
import Config from '../config';

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
export const setAuthKey = (_authKey: string) => authKey = _authKey;

const api: ApiInvoker = async<T>(method: string, props: IApiInvokeProps = {}): Promise<T> => {
    if (authKey) {
        props.authKey = authKey;
    }

    if (!('v' in props)) {
        props.v = 250;
    }

    const res = await fetch(`${Config.API_BASE_DOMAIN}${Config.API_BASE_PATH}${method}`, {
        method: 'post',
        mode: 'cors',
        cache: 'no-cache',
        redirect: 'follow',
        referrer: 'no-referrer',
        body: getFormData(props),
    });

    const json: IApiResult<T> = await res.json();

    if ('error' in json) {
        throw json.error;
    }

    return json.result;
};

export { api };
export * from './types';
import * as API from './blocks'
export default API;
