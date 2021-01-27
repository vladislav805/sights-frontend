import { apiRequest } from '../index';
import { IPageContent } from '../types/page';

export const internal = {
    getPage: async(pageId: string): Promise<IPageContent> =>
        apiRequest('internal.getPage', { pageId }),
};
