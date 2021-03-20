import { LatLngTuple } from 'leaflet';
import apiRequest from '../request';
import { IPlace } from '../types/place';
import { IApiList } from '../types/api';
import { ISight } from '../types/sight';
import { ICityExtended } from '../types/city';

type IMapGetSightsParams = {
    topLeft: LatLngTuple;
    bottomRight: LatLngTuple;
    fields?: string[];
    filters?: string[];
    count?: number;
};

type IMapGetCitiesParams = {
    topLeft: LatLngTuple;
    bottomRight: LatLngTuple;
    onlyImportant?: boolean;
    count?: number;
};

type IMapGetPlacesParams = {
    topLeft: LatLngTuple;
    bottomRight: LatLngTuple;
    count?: number;
};

type IMapAddPlaceParams = {
    latitude: number;
    longitude: number;
};

const map = {
    getSights: async({ topLeft, bottomRight, ...params }: IMapGetSightsParams): Promise<IApiList<ISight>> =>
        apiRequest('map.getSights', {
            area: [topLeft, bottomRight].map(i => i.join(',')).join(';'),
            ...params,
        }),

    getCities: async({ topLeft, bottomRight, ...params }: IMapGetCitiesParams): Promise<IApiList<ICityExtended>> =>
        apiRequest('map.getCities', {
            area: [topLeft, bottomRight].map(i => i.join(',')).join(';'),
            ...params,
        }),

    getPlaces: async({ topLeft, bottomRight, ...params }: IMapGetPlacesParams): Promise<IApiList<IPlace>> =>
        apiRequest('map.getPlaces', {
            area: [topLeft, bottomRight].map(i => i.join(',')).join(';'),
            ...params,
        }),

    addPlace: async(params: IMapAddPlaceParams): Promise<IPlace> =>
        apiRequest<IPlace>('map.addPlace', params),
};

export default map;
