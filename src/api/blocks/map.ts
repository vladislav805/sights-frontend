import { LatLngTuple } from 'leaflet';
import { IApiList, ICity, ISight } from '../types';
import { apiNew } from '../index';
import { IPlace } from '../types/place';

type IMapGetSights = {
    topLeft: LatLngTuple;
    bottomRight: LatLngTuple;
    fields?: string[];
    filters?: string[];
    count?: number;
};

type IMapGetCities = {
    topLeft: LatLngTuple;
    bottomRight: LatLngTuple;
    onlyImportant?: boolean;
    count?: number;
};

type IMapGetPlaces = {
    topLeft: LatLngTuple;
    bottomRight: LatLngTuple;
    count?: number;
};

type IMapAddPlace = {
    latitude: number;
    longitude: number;
};

export const map = {
    getSights: async({ topLeft, bottomRight, ...params }: IMapGetSights): Promise<IApiList<ISight>> =>
        apiNew('map.getSights', {
            area: [topLeft, bottomRight].map(i => i.join(',')).join(';'),
            ...params,
        }),

    getCities: async({ topLeft, bottomRight, ...params }: IMapGetCities): Promise<IApiList<ICity>> =>
        apiNew('map.getCities', {
            area: [topLeft, bottomRight].map(i => i.join(',')).join(';'),
            ...params,
        }),

    getPlaces: async({ topLeft, bottomRight, ...params }: IMapGetPlaces): Promise<IApiList<IPlace>> =>
        apiNew('map.getPlaces', {
            area: [topLeft, bottomRight].map(i => i.join(',')).join(';'),
            ...params,
        }),

    addPlace: async(params: IMapAddPlace): Promise<IPlace> =>
        apiNew<IPlace>('map.addPlace', params),
};
