import { apiRequest } from '../index';
import { ITag } from '../types/tag';

type ITagsSearchParams = {
    query: string;
};

export const tags = {
    search: async(params: ITagsSearchParams): Promise<ITag[]> =>
        apiRequest<ITag[]>('tags.search', params),
};
