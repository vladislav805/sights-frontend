import { IUser } from './user';

export interface ISession {
    authId: number;
    authKey: string;
    userId: number;
    date: number;
    user?: IUser;
}
