import * as React from 'react';
import { IFeedItem, IFeedItemCollection, IFeedItemComment, IFeedItemPhoto, IFeedItemSight } from '../../api/types/feed';
import { IUser } from '../../api/types/user';
import { ISight } from '../../api/types/sight';
import { ICollection } from '../../api/types/collection';
import { IPhoto } from '../../api/types/photo';
import { IComment } from '../../api/types/comment';
import { getSightFeedItemHeader, SightFeedItem } from './Sight';
import { getPhotoFeedItemHeader, PhotoFeedItem } from './Photo';
import { CollectionFeedItem, getCollectionFeedItemHeader } from './Comment';
import { CommentFeedItem, getCommentFeedItemHeader } from './Collection';

export type IFeedBaseProps<T extends IFeedItem = IFeedItem> = {
    item: T;
    users: Map<number, IUser>;
    sights: Map<number, ISight>;
    collections: Map<number, ICollection>;
    photos: Map<number, IPhoto>;
    comments: Map<number, IComment>;
};

export type AllowedType = 'sight' | 'collection' | 'photo' | 'comment';

export type IFeedRenderer = (props: IFeedBaseProps, actor: IUser) => {
    header: React.ReactNode;
    content: React.ReactNode;
};

export const renderers: Record<AllowedType, IFeedRenderer> = {
    sight: (props: IFeedBaseProps<IFeedItemSight>, actor) => ({
        header: getSightFeedItemHeader(actor),
        content: React.createElement(SightFeedItem, props),
    }),

    photo: (props: IFeedBaseProps<IFeedItemPhoto>, actor) => ({
        header: getPhotoFeedItemHeader(props, actor),
        content: React.createElement(PhotoFeedItem, props),
    }),

    collection: (props: IFeedBaseProps<IFeedItemCollection>, actor) => ({
        header: getCollectionFeedItemHeader(actor),
        content: React.createElement(CollectionFeedItem, props),
    }),

    comment: (props: IFeedBaseProps<IFeedItemComment>, actor) => ({
        header: getCommentFeedItemHeader(props, actor),
        content: React.createElement(CommentFeedItem, props),
    }),
};


