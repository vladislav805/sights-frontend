import { ISight } from './sight';
import { ICity } from './city';

export type CollectionType = 'PUBLIC' | 'PRIVATE' | 'DRAFT';

export interface ICollection {
    collectionId: number;
    ownerId: number;
    title: string;
    content: string;
    dateCreated: number;
    dateUpdated: number;
    tags: number[];
    type: CollectionType;
    cityId: number;
    size: number;

    city?: ICity | null;
    rating?: ICollectionRating;
}

export interface ICollectionExtended extends ICollection {
    items: ISight[];
}

export type ICollectionRating = {
    value: number;
    count: number;
    rated?: number;
};
