import { IApiList } from '../types';
import { ICategory } from '../types/category';
import { apiNew } from '../index';

export const categories = {
    get: async(): Promise<IApiList<ICategory>> =>
        apiNew<IApiList<ICategory>>('categories.get'),
};
