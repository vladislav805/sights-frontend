import { LatLngTuple } from 'leaflet';
import { IApiList, ICity, ISight } from '../types';
import { apiNew } from '../index';

export const map = {
    getSights: async(
        topLeft: LatLngTuple,
        bottomRight: LatLngTuple,
        fields?: string[],
        filters?: string[],
    ): Promise<IApiList<ISight>> =>
        apiNew('map.getSights', {
            area: [topLeft, bottomRight].map(i => i.join(',')).join(';'),
            fields,
            filters,
            count: 400,
        }),

    getCities: async(
        topLeft: LatLngTuple,
        bottomRight: LatLngTuple,
    ): Promise<IApiList<ICity>> =>
        apiNew('map.getCities', {
            area: [topLeft, bottomRight].map(i => i.join(',')).join(';'),
            count: 200,
        }),
};
