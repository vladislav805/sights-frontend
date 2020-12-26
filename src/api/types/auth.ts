import { IUser } from './user';

export interface IAuthSession {
    authId: number;
    authKey: string;
    userId: number;
    date: number;
    user: IUser;
}
