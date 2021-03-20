import * as React from 'react';
import { IFeedItem } from '../../api/types/feed';
import { IUser } from '../../api/types/user';
import { ISight } from '../../api/types/sight';
import { ICollection } from '../../api/types/collection';
import { IPhoto } from '../../api/types/photo';
import { IComment } from '../../api/types/comment';

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
