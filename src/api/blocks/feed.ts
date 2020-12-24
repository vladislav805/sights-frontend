import { apiRequest } from '../index';
import { IApiListExtended } from '../types/api';
import { IFeedItem } from '../types/feed';

type IFeedParams = {
    count?: number;
    offset?: number;
    fields?: string[];
};

export const feed = {
    get: async(params: IFeedParams): Promise<IApiListExtended<IFeedItem>> =>
        apiRequest('feed.get', params),
};
