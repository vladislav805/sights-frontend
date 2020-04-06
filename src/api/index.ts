import * as Type from './types';
import Config from '../config';

type IApiInvokeValue = string | number | boolean;
type IApiInvokeProps = Record<string, IApiInvokeValue>;
type IApiResult<T> = Type.IApiResponse<T> | { error: Type.IApiError };
type ApiInvoker = <T>(method: string, props: IApiInvokeProps) => Promise<T>;

const getFormData = (props: IApiInvokeProps) => {
    const fd = new FormData();
    for (const [k, v] of Object.entries(props)) {
        fd.append(k, String(v));
    }
    return fd;
};

let authKey: string;
export const setAuthKey = (_authKey: string) => authKey = _authKey;

const api: ApiInvoker = async<T>(method: string, props: IApiInvokeProps = {}): Promise<T> => {
    if (authKey) {
        props.authKey = authKey;
    }

    const res = await fetch(`${Config.API_BASE_DOMAIN}${Config.API_BASE_PATH}${method}`, {
        method: 'post',
        body: getFormData(props),
    });

    const json: IApiResult<T> = await res.json();

    if ('error' in json) {
        throw json.error;
    }

    return json.result;
};

export default api;
export * from './types';
