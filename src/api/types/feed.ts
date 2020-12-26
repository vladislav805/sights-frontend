import { ISight } from './sight';
import { IPhoto } from './photo';

export type IFeedItem = IFeedItemSight | IFeedItemPhoto;

export type IFeedItemSight = {
    type: 'sight';
    ownerId: number;
    date: number;
    sight: ISight;
};

export type IFeedItemPhoto = {
    type: 'photo';
    ownerId: number;
    date: number;
    photo: IPhoto;
    sight: ISight;
};
