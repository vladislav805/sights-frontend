import { IPageContent } from '../types';
import { api } from '../index';

export const internal = {
    getPage: async(id: string): Promise<IPageContent> => api('internal.getPage', { id }),
};
