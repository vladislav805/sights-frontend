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
    cityId?: number;
    size: number;
}
