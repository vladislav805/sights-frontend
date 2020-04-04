import * as Type from './types';

export type ApiInvoker = <T>(method: string, props: Record<string, string | number | boolean>) => Promise<T>;

const API_HOST = 'https://sights.vlad805.ru';
let authKey: string;

const getFormData = (props: Record<string, string | number | boolean>) => {
    const fd = new FormData();
    for (const [k, v] of Object.entries(props)) {
        fd.append(k, String(v));
    }
    return fd;
};

export const setAuthKey = (_authKey: string) => authKey = _authKey;

const api: ApiInvoker = async<T>(method: string, props: Record<string, string | number | boolean> = {}): Promise<T> => {
    if (authKey) {
        props.authKey = authKey;
    }
    const res = await fetch(`${API_HOST}/api/v2/${method}`, {
        method: 'post',
        body: getFormData(props),
    });
    type Result = Type.IApiResponse<T> | { error: Type.IApiError };
    const json: Result = await res.json();

    if ('error' in json) {
        throw json.error;
    }

    return json.result;
};

export default api;
export * from './types';
