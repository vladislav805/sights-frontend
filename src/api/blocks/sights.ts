import { api, ISight, List } from '../index';
import { LatLngTuple } from 'leaflet';

type Coords = LatLngTuple;

export const sights = {
    get: async([lat1, lng1]: Coords, [lat2, lng2]: Coords, props: {
        onlyVerified?: boolean;
        count?: number;
        offset?: number;
    } = {
        offset: 0,
        count: 500,
    }): Promise<List<ISight> & { type: 'sights' | 'cities' }> => api('sights.get', {
        lat1, lng1, lat2, lng2, ...props,
    }),

    getRandomSightId: async(): Promise<number> => api('sights.getRandomSightId'),

    getOwns: async(ownerId: number, count = 30, offset = 0): Promise<List<ISight>> => api('sights.getOwns', {
        ownerId,
        count,
        offset,
    }),
};
