import fetch from 'node-fetch';
import * as querystring from 'querystring';
import { IApiParams } from '../api/types/api';
import { IApiError } from '../api/types/base';

export const apiRequestRpc = <T>(method: string, params: IApiParams): Promise<T> =>
    fetch(`http://localhost:3800/api/${method}?${querystring.stringify(params)}`)
        .then(res => res.json())
        .then((res: { result: T } | { error: IApiError }) => {
            if ('result' in res) {
                return res.result;
            }

            // eslint-disable-next-line @typescript-eslint/no-throw-literal
            throw res.error;
        });
