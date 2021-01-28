import { ICity } from './city';
import { IPhoto } from './photo';
import { IUserRank } from './rank';

export type IUser = {
    userId: number;
    login: string;
    firstName: string;
    lastName: string;
    sex: Sex;
    lastSeen: number;
    isOnline?: boolean;
    status?: 'INACTIVE' | 'USER' | 'MODERATOR' | 'ADMIN' | 'BANNED';
    bio?: string;
    photo?: IPhoto | null;
    city?: ICity | null;
    followers?: number;
    isFollowed?: boolean;
    rank?: IUserRank;
};

export const enum Sex {
    NONE = 'NOT_SET',
    FEMALE = 'FEMALE',
    MALE = 'MALE',
}

export type IUserAchievements = {
    sights: {
        created: number;
        verified: number;
        visited: number;
        desired: number;
    };
    collections: {
        created: number;
    };
    photos: {
        uploaded: number;
    };
    comments: {
        added: number;
    };
};
