import { apiRequest } from '../index';
import { IPageContent } from '../types/page';

export const internal = {
    getPage: async(id: string): Promise<IPageContent> =>
        apiRequest('internal.getPage', { id }),
};
