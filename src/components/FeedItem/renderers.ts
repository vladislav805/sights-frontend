import * as React from 'react';
import { IFeedItemCollection, IFeedItemComment, IFeedItemPhoto, IFeedItemSight } from '../../api/types/feed';
import { getSightFeedItemHeader, SightFeedItem } from './Sight';
import { getPhotoFeedItemHeader, PhotoFeedItem } from './Photo';
import { CollectionFeedItem, getCollectionFeedItemHeader } from './Comment';
import { CommentFeedItem, getCommentFeedItemHeader } from './Collection';
import { AllowedType, IFeedBaseProps, IFeedRenderer } from './common';

const renderers: Record<AllowedType, IFeedRenderer> = {
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

export default renderers;
