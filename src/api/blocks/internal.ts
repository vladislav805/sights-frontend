import apiRequest from '../request';
import { IPageContent } from '../types/page';

const internal = {
    getPage: async(pageId: string): Promise<IPageContent> =>
        apiRequest('internal.getPage', { pageId }),
};

export default internal;
