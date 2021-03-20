import apiRequest from '../request';
import { ITag } from '../types/tag';

type ITagsSearchParams = {
    query: string;
};

const tags = {
    search: async(params: ITagsSearchParams): Promise<ITag[]> =>
        apiRequest<ITag[]>('tags.search', params),
};

export default tags;
