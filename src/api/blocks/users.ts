import { apiRequest } from '../index';
import { IUser } from '../types/user';
import { IApiList } from '../types/api';

type UserExtras = 'ava' | 'rating' | 'city' | 'followers' | 'isFollowed' | 'rank';

type IApiUsersFollowResult = {
    result: boolean;
    count: number;
};

type IUsersSearchParams = {
    query?: string;
    fields?: UserExtras[];
    cityId?: number;
    count?: number;
    offset?: number;
};

export const users = {
    getUser: async(userId: number | string, fields: UserExtras[] = []): Promise<IUser> => {
        const [user] = await apiRequest<IUser[]>('users.get', { userIds: userId, fields });
        return user;
    },

    follow: async(userId: number, follow: boolean): Promise<IApiUsersFollowResult> =>
        apiRequest<IApiUsersFollowResult>('users.follow', { userId, follow }),

    search: async(params: IUsersSearchParams): Promise<IApiList<IUser>> =>
        apiRequest<IApiList<IUser>>('users.search', params),
};
