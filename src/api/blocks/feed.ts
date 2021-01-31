import { apiRequest } from '../index';
import { IApiListExtended } from '../types/api';
import { IFeedItem } from '../types/feed';
import { ISight } from '../types/sight';
import { ICollection } from '../types/collection';
import { IPhoto } from '../types/photo';
import { IComment } from '../types/comment';

type IFeedParams = {
    count?: number;
    offset?: number;
    fields?: string[];
};

export const feed = {
    get: async(params: IFeedParams): Promise<IApiListExtended<IFeedItem> & {
        sights: ISight[];
        collections: ICollection[];
        photos: IPhoto[];
        comments: IComment[];
    }> =>
        apiRequest('feed.get', params),
};
