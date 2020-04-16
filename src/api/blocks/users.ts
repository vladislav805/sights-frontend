import { IAuthSession, IUser, IUserAchievements } from '../types';
import { api } from '../index';

type UserExtras = 'photo' | 'rating' | 'city' | 'extended';

export const users = {
    get: async(userIds: number | number[] | string | string[], extra: UserExtras[] = []): Promise<IUser[]> => api('users.get', {
        userIds, extra
    }),

    getUser: async(userId: number | string, extra: UserExtras[] = []): Promise<IUser> => {
        const [user] = await api<IUser[]>('users.get', { userIds: userId, extra });
        return user;
    },

    getAchievements: async(userId: number): Promise<IUserAchievements> => api('users.getAchievements', {
        userId,
    }),

    getAuthKey: async(login: string, password: string): Promise<IAuthSession> => api('users.getAuthKey', {
        login,
        password,
    }),

    logout: async(): Promise<true> => api('users.logout'),
};
