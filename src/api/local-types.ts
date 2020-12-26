import { IUser } from './types/user';
import { ISight, ISightDistance } from './types/sight';
import { IComment } from './types/comment';
import { IPhoto } from './types/photo';

type WithUser = { user: IUser };

export type IUsableComment = IComment & WithUser;

export type IUsableSightWithDistance = ISight & ISightDistance;

export type IUsablePhoto = IPhoto & WithUser;

export type ISiteStats = {
    total: number;
    verified: number;
    archived: number;
};
