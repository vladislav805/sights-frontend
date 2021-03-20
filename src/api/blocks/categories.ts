import { ICategory } from '../types/category';
import apiRequest from '../request';
import { IApiList } from '../types/api';

const categories = {
    get: async(): Promise<IApiList<ICategory>> =>
        apiRequest<IApiList<ICategory>>('categories.get'),
};

export default categories;
