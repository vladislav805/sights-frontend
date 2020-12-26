import { ICategory } from '../types/category';
import { apiRequest } from '../index';
import { IApiList } from '../types/api';

export const categories = {
    get: async(): Promise<IApiList<ICategory>> =>
        apiRequest<IApiList<ICategory>>('categories.get'),
};
