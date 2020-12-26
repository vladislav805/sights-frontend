import { apiRequest } from '../index';
import { IUser } from '../types/user';

type UserExtras = 'ava' | 'rating' | 'city' | 'followers' | 'isFollowed';

type IApiUsersFollowResult = {
    result: boolean;
    count: number;
};

export const users = {
    getUser: async(userId: number | string, fields: UserExtras[] = []): Promise<IUser> => {
        const [user] = await apiRequest<IUser[]>('users.get', { userIds: userId, fields });
        return user;
    },

    follow: async(userId: number, follow: boolean): Promise<IApiUsersFollowResult> =>
        apiRequest<IApiUsersFollowResult>('users.follow', { userId, follow }),
};
