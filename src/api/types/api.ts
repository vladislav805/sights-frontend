import { IUser } from './user';

export type ApiParam = string | number | boolean | string[] | number[];
export type IApiParams = Record<string, ApiParam> & { authKey?: string };
export type IApiList<T> = {
    count?: number;
    items: T[];
};

export type IApiListExtended<T> = IApiList<T> & { users: IUser[] };
