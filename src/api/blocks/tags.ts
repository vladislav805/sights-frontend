import { ITag } from '../types';
import { apiNew } from '../index';

type ITagsSearchParams = {
    query: string;
};

export const tags = {
    search: async(params: ITagsSearchParams): Promise<ITag[]> =>
        apiNew<ITag[]>('tags.search', params),
};
