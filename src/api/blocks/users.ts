import { IUser, IUserAchievements } from '../types';
import { api, apiNew } from '../index';

type UserExtras = 'ava' | 'rating' | 'city' | 'followers' | 'isFollowed';

type IApiUsersFollowResult = {
    result: boolean;
    count: number;
};

export const users = {
    get: async(userIds: number | number[] | string | string[], extra: UserExtras[] = []): Promise<IUser[]> => apiNew('users.get', {
        userIds,
        extra,
    }),

    getUser: async(userId: number | string, fields: UserExtras[] = []): Promise<IUser> => {
        const [user] = await apiNew<IUser[]>('users.get', { userIds: userId, fields });
        return user;
    },

    follow: async(userId: number, follow: boolean): Promise<IApiUsersFollowResult> => apiNew<IApiUsersFollowResult>('users.follow', {
        userId,
        follow,
    }),

    getAchievements: async(userId: number): Promise<IUserAchievements> => api('users.getAchievements', {
        userId,
    }),
};
