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

export interface List<T> {
    count: number;
    items: T[];
}

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

export interface IUserAchievements {
    visitedSights: number;
    authorOfSights: number;
    authorOfAllSights: number;
    authorOfCollections: number;
    photosOfSights: number;
    comments: number;
}

export interface ISight {
    ownerId: number;
    sightId: number;
    markIds: number[];
    lat: number;
    lng: number;
    dateCreated: number;
    dateUpdated: number;
    title: string;
    description: string;
    city?: ICity;
    isVisited: boolean;
    isArchived: boolean;
    visitState: VisitState;
    rating: {
        value: number;
        userValue: -1 | 0 | 1;
    };
    canModify?: boolean;
    photo?: IPhoto;
}

export const enum VisitState {

}

export interface ICity {
    cityId: number;
    name: string; // todo: переименовать в title
    parentId?: number;
    lat: number;
    lng: number;
    description: string;
    radius: number;
    count?: number;
}

export interface IMark {
    markId: number;
    title: string;
    color?: string;
    count?: number;
}

export interface IPhoto {
    ownerId: number;
    photoId: number;
    date: number;
    photo200: string;
    photoMax: string;
    type: PhotoType;
    latitude?: number;
    longitude?: number;
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

export interface IEventList extends List<IEvent> {
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

export interface IPageContent<C = string> {
    title: string;
    content: C;
}
