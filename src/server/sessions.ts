import { IUser } from '../api/types/user';
import { apiRequestRpc } from './api-rpc';

type ICacheItem = {
    timestamp: number;
    user: IUser;
};

const TTL = 30;

const users = new Map<string, ICacheItem>();

export const getUserByAuthKey = async(authKey: string): Promise<IUser> => {
    if (authKey) {
        const now = (Date.now() / 1000) | 0;

        if (!users.has(authKey) || now - users.get(authKey).timestamp > TTL) {
            const res = await apiRequestRpc<IUser[]>('users.get', { authKey, fields: 'ava' });

            const user = res?.[0];

            if (user) {
                users.set(authKey, {
                    user: res?.[0],
                    timestamp: now,
                });
            }
        }

        return users.get(authKey).user;
    }

    return undefined;
};
