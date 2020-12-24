export interface ICollection {
    collectionId: number;
    ownerId: number;
    title: string;
    description: string;
    dateCreated: number;
    dateUpdated: number;
    tags: number[];
    size: number;
}
