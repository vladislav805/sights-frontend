import { IApiError } from './types/base';
import { getAuthKey } from './auth-key';

type IApiResponse<T> = {
    result: T;
};

type IApiInvokeValue = string | string[] | number | number[] | boolean;
type IApiInvokeProps = Record<string, IApiInvokeValue>;
type IApiResult<T> = IApiResponse<T> | { error: IApiError };
type ApiInvoker = <T>(method: string, props?: IApiInvokeProps) => Promise<T>;

const local = ['0.0.0.0', '192.168.1.200', 'local.sights.velu.ga'];

const apiRequest: ApiInvoker = async<T>(method: string, props: IApiInvokeProps = {}): Promise<T> => {
    const ak = getAuthKey();
    if (ak) {
        // eslint-disable-next-line no-param-reassign
        props.authKey = ak;
    }

    const domain = local.includes(window.location.hostname)
        ? 'http://local.sights.velu.ga'
        : 'https://sights.velu.ga';

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
                // eslint-disable-next-line @typescript-eslint/no-throw-literal
                throw res.error;
            }

            return res.result;
        });
};

export const apiExecute = async<T>(code: string, props: IApiInvokeProps = {}): Promise<T> => apiRequest('execute', { code, ...props });

export default apiRequest;
