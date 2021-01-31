export type IFeedItem = IFeedItemSight | IFeedItemPhoto | IFeedItemCollection | IFeedItemComment;

export type IFeedItemSight = {
    type: 'sight';
    actorId: number;
    date: number;
    sightId: number;
};

export type IFeedItemPhoto = {
    type: 'photo';
    actorId: number;
    date: number;
    photoId: number;
    sightId: number;
};

export type IFeedItemCollection = {
    type: 'collection';
    actorId: number;
    date: number;
    collectionId: number;
};

export type IFeedItemComment = {
    type: 'comment';
    actorId: number;
    date: number;
    commentId: number;
    sightId?: number;
    collectionId?: number;
};
