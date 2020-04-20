import { api, ISight, ISiteStats, List, IVisitStateStats, VisitState, ListOfSightsWithDistances } from '../index';
import { LatLngTuple } from 'leaflet';

type SetVisitStateResult = {
    change: boolean;
    state: IVisitStateStats;
};

// noinspection JSUnusedGlobalSymbols
export const sights = {
    get: async([lat1, lng1]: LatLngTuple, [lat2, lng2]: LatLngTuple, props: {
        onlyVerified?: boolean;
        count?: number;
        offset?: number;
    } = {
        offset: 0,
        count: 500,
    }): Promise<List<ISight> & { type: 'sights' | 'cities' }> => api('sights.get', {
        lat1, lng1, lat2, lng2, ...props,
    }),

    getById: async(sightId: number): Promise<ISight> => api('sights.getById', { sightId }),

    setVisitState: async(sightId: number, state: VisitState): Promise<SetVisitStateResult> => api('sights.setVisitState', { sightId, state }),

    getRandomSightId: async(): Promise<number> => api('sights.getRandomSightId'),

    getNearby: async([lat, lng]: LatLngTuple, distance: number, count = 30): Promise<ListOfSightsWithDistances> => api('sights.getNearby', { lat, lng, distance, count }),

    getOwns: async(ownerId: number, count = 30, offset = 0): Promise<List<ISight>> => api('sights.getOwns', {
        ownerId,
        count,
        offset,
    }),

    getCounts: async(): Promise<ISiteStats> => api('sights.getCounts'),
};
