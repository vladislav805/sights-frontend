import { apiRequest } from '../index';
import { CollectionType, ICollection } from '../types/collection';
import { IApiList } from '../types/api';

type ICollectionsGetParams = {
    ownerId: number;
    count?: number;
    offset?: number;
    fields?: string[];
};

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
    get: async(params: ICollectionsGetParams): Promise<IApiList<ICollection>> =>
        apiRequest('collections.get', params),

    add: async(params: ICollectionsAddParams): Promise<ICollection> =>
        apiRequest('collections.add', params),

    edit: async(params: ICollectionsEditParams): Promise<ICollection> =>
        apiRequest('collections.edit', params),

    remove: async(params: ICollectionsRemoveParams): Promise<boolean> =>
        apiRequest('collections.remove', params),

    setAffiliate: async(params: ICollectionsSetAffiliateParams): Promise<boolean> =>
        apiRequest('collections.setAffiliation', params),
};
