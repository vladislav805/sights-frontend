import { apiRequest } from '../index';
import { IApiList } from '../types/api';
import { ICity } from '../types/city';

type ICitiesGetParams = {
    count?: number;
    offset?: number;
    all?: boolean;
    extended?: boolean;
};

type ICitiesGetByIdParams = {
    cityIds: number | number[];
    extended?: boolean;
};

type ICitiesSearchParams = {
    query: string;
    count?: number;
    extended?: boolean;
};

export const cities = {
    get: async(params: ICitiesGetParams): Promise<IApiList<ICity>> =>
        apiRequest<IApiList<ICity>>('cities.get', params),

    getById: async(params: ICitiesGetByIdParams): Promise<ICity[]> =>
        apiRequest<ICity[]>('cities.getById', params),

    search: async(params: ICitiesSearchParams): Promise<ICity[]> =>
        apiRequest<ICity[]>('cities.search', params),
};
