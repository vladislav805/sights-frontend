import { api, ISight, ISiteStats, IVisitStateStats, VisitState, ListOfSightsWithDistances, IApiList, apiNew } from '../index';
import { LatLngTuple } from 'leaflet';

type SetVisitStateResult = {
    change: boolean;
    state: IVisitStateStats;
};

// noinspection JSUnusedGlobalSymbols
export const sights = {
    getById: async(sightId: number): Promise<ISight> => apiNew('sights.getById', { sightId }),

    setVisitState: async(sightId: number, state: VisitState): Promise<SetVisitStateResult> => api('sights.setVisitState', { sightId, state }),

    getRandomSightId: async(): Promise<number> => api('sights.getRandomSightId'),

    getNearby: async([lat, lng]: LatLngTuple, distance: number, count = 30): Promise<ListOfSightsWithDistances> => api('sights.getNearby', { lat, lng, distance, count }),

    getByUser: async(ownerId: number, count = 30, offset = 0): Promise<IApiList<ISight>> => apiNew('sights.get', {
        ownerId,
        count,
        offset,
        fields: 'photo',
    }),

    getCounts: async(): Promise<ISiteStats> => apiNew('sights.getCounts'),

    getRecent: async(count: number, fields: string[] = []): Promise<IApiList<ISight>> => apiNew('sights.getRecent', {
        count,
        fields,
    }),
};
