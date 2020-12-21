import { IApiListExtended, IFeedItem } from '../types';
import { apiNew } from '../index';

export const feed = {
    get: async(count: number, offset = 0, fields: string[] = []): Promise<IApiListExtended<IFeedItem>> => apiNew('feed.get', {
        count,
        offset,
        fields,
    }),
};
