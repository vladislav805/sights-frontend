import { IUser, IUserAchievements } from '../types';
import { api, apiNew } from '../index';

type UserExtras = 'ava' | 'rating' | 'city' | 'followers' | 'isFollowed';

export const users = {
    get: async(userIds: number | number[] | string | string[], extra: UserExtras[] = []): Promise<IUser[]> => apiNew('users.get', {
        userIds,
        extra,
    }),

    getUser: async(userId: number | string, fields: UserExtras[] = []): Promise<IUser> => {
        const [user] = await apiNew<IUser[]>('users.get', { userIds: userId, fields });
        return user;
    },

    getAchievements: async(userId: number): Promise<IUserAchievements> => api('users.getAchievements', {
        userId,
    }),
};
