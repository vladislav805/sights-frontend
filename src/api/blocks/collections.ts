import apiRequest from '../request';
import { CollectionType, ICollection } from '../types/collection';
import { IApiList } from '../types/api';

type CollectionField = 'collection_city' | 'collection_rating';

type ICollectionsGetParams = {
    ownerId: number;
    count?: number;
    offset?: number;
    fields?: CollectionField[];
};

type ICollectionsSearchParams = {
    query: string;
    cityId?: number;
    count?: number;
    offset?: number;
    fields?: CollectionField[];
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

const collections = {
    get: async(params: ICollectionsGetParams): Promise<IApiList<ICollection>> =>
        apiRequest('collections.get', params),

    search: async(params: ICollectionsSearchParams): Promise<IApiList<ICollection>> =>
        apiRequest('collections.search', params),

    add: async(params: ICollectionsAddParams): Promise<ICollection> =>
        apiRequest('collections.add', params),

    edit: async(params: ICollectionsEditParams): Promise<ICollection> =>
        apiRequest('collections.edit', params),

    remove: async(params: ICollectionsRemoveParams): Promise<boolean> =>
        apiRequest('collections.remove', params),

    setAffiliate: async(params: ICollectionsSetAffiliateParams): Promise<boolean> =>
        apiRequest('collections.setAffiliation', params),
};

export default collections;
