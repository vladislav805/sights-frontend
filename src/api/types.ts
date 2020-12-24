export interface IApiResponse<T> {
    result: T;
}

export interface IApiError {
    errorId: number;
    message?: string;
}

export interface IAuthSession {
    authId: number;
    authKey: string;
    userId: number;
    date: number;
    user: IUser;
}

export interface IPoint {
    latitude: number;
    longitude: number;
}

export interface IApiList<T> {
    count: number;
    items: T[];
}

export type IApiListExtended<T> = IApiList<T> & { users: IUser[] };

export interface IUser {
    userId: number;
    login: string;
    firstName: string;
    lastName: string;
    sex: UserSex;
    lastSeen?: number;
    isOnline?: boolean;
    // extra
    photo?: IPhoto;
    city?: ICity;
    bio?: string;
    // extended
    status?: UserStatus;
    email?: string;
    telegramId?: number;
    vkId?: number;
    followers?: number;
    isFollowed?: boolean;
}

export enum UserStatus {
    USER = 'USER',
    MODERATOR = 'MODERATOR',
    ADMIN = 'ADMIN'
}

export enum UserSex {
    NOT_SET = 'NOT_SET',
    FEMALE = 'FEMALE',
    MALE = 'MALE'
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

export interface ISight extends IPoint {
    placeId: number;
    ownerId: number;
    sightId: number;
    dateCreated: number;
    dateUpdated: number;
    title: string;
    description: string;
    city?: ICity;
    mask: number;
    visitState: VisitState;
    rating: {
        value: number;
        userValue: -1 | 0 | 1;
    };
    canModify?: boolean;
    photo?: IPhoto;
}

export const enum SightMask {
    VERIFIED = 2,
    ARCHIVED = 4,
}

export const enum VisitState {
    DEFAULT = 0,
    VISITED = 1,
    DESIRED = 2,
}

export type IVisitStateStats = {
    visited: number;
    desired: number;
};

export type ISightDistance = {
    sightId: number;
    distance: number;
};

export type ListOfSightsWithDistances = IApiList<ISight> & { distances: ISightDistance[] };

export interface ICity extends IPoint {
    cityId: number;
    name: string;
    parent?: ICity;
    description: string;
    radius: number;
    count?: number;
}


export interface IPhoto extends IPoint {
    ownerId: number;
    photoId: number;
    date: number;
    photo200: string;
    photoMax: string;
    type: PhotoType;
    width?: number;
    height?: number;
}

export const enum PhotoType {
    SIGHT = 1,
    PROFILE = 2,
    SUGGEST = 4
}

export interface IComment {
    commentId: number;
    userId: number;
    date: number;
    text: string;
    canModify?: boolean;
}

export interface IEventList extends IApiList<IEvent> {
    users: IUser[];
    sights: ISight[];
    photos: IPhoto[];
}

export interface IEvent {
    eventId: number;
    date: number;
    type: EventType;
    ownerUserId: number;
    actionUserId: number;
    subjectId: number;
    isNew: boolean;
}

export const enum EventType {
    SIGHT_VERIFIED = 1,
    COMMENT_ADDED = 8,
    SIGHT_ARCHIVED = 12,
    RATING_CHANGE = 14,
}

export interface IUsableEvent extends IEvent {
    actionUser: IUser;
    sight?: ISight;
    photo?: IPhoto;
}

export interface IUsableComment extends IComment {
    user: IUser;
}

export type IUsableSightWithDistance = ISight & ISightDistance;

export interface IUsablePhoto extends IPhoto {
    user: IUser;
}

export interface IPageContent<C = string> {
    title: string;
    content: C;
}

export interface ISiteStats {
    total: number;
    verified: number;
    archived: number;
}

export interface IPoint {
    lat: number;
    lng: number;
}

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

export interface ITag {
    tagId: number;
    title: string;
}
