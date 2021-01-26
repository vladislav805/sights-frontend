import { apiRequest } from '../index';
import { CollectionType, ICollection } from '../types/collection';

type ICollectionsAddParams = {
    title: string;
    content: string;
    type: CollectionType;
    cityId?: number | null;
};

type ICollectionsEditParams = {
    collectionId: number;
} & ICollectionsAddParams;

type ICollectionsRemoveParams = {
    collectionId: number;
};

type ICollectionsSetAffiliateParams = {
    collectionId: number;
    sightId: number;
    affiliate: boolean;
};

export const collections = {
    add: async(params: ICollectionsAddParams): Promise<ICollection> =>
        apiRequest('collections.add', params),

    edit: async(params: ICollectionsEditParams): Promise<ICollection> =>
        apiRequest('collections.edit', params),

    remove: async(params: ICollectionsRemoveParams): Promise<boolean> =>
        apiRequest('collections.remove', params),

    setAffiliate: async(params: ICollectionsSetAffiliateParams): Promise<boolean> =>
        apiRequest('collections.setAffiliation', params),
};
