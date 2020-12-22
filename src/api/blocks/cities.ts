import { IApiList, ICity } from '../types';
import { apiNew } from '../index';

type ICitiesGet = {
    count?: number;
    offset?: number;
    all?: boolean;
    extended?: boolean;
};

type ICitiesGetById = {
    cityIds: number | number[];
    extended?: boolean;
};

type ICitiesSearch = {
    query: string;
    count?: number;
    extended?: boolean;
};

export const cities = {
    get: async(params: ICitiesGet): Promise<IApiList<ICity>> => apiNew<IApiList<ICity>>('cities.get', params),

    getById: async(params: ICitiesGetById): Promise<ICity[]> => apiNew<ICity[]>('cities.getById', params),

    search: async(params: ICitiesSearch): Promise<ICity[]> => apiNew<ICity[]>('cities.search', params),
};
