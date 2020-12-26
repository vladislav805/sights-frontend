import { ISight, VisitState } from '../types/sight';
import { IApiList } from '../types/api';
import { apiRequest } from '..';
import { ISiteStats } from '../local-types';

type ISightGetByIdParams = {
    sightIds: number | number[];
    fields: string[];
};

type ISightSetVisitStateParams = {
    sightId: number;
    state: VisitState;
};

type ISightSetVisitStateResult = {
    state: boolean;
    stat: ISightGetVisitStateResult;
};

type ISightGetVisitStateResult = {
    visited: number;
    desired: number;
};

type ISightsGetParams = {
    ownerId: number;
    count?: number;
    offset?: number;
    fields: string[];
};

type ISightsGetRecentParams = {
    count?: number;
    fields?: string[];
};

type ISightsAddParams = {
    placeId: number;
    title: string;
    description: string;
    cityId?: number;
    categoryId?: number;
    tags?: string[];
};

type ISightsEditParams = ISightsAddParams & {
    sightId: number;
};

export const sights = {
    getById: async(params: ISightGetByIdParams): Promise<IApiList<ISight>> =>
        apiRequest<IApiList<ISight>>('sights.getById', params),

    setVisitState: async(props: ISightSetVisitStateParams): Promise<ISightSetVisitStateResult> =>
        apiRequest<ISightSetVisitStateResult>('sights.setVisitState', props),

    getRandomSightId: async(): Promise<number> =>
        apiRequest<number>('sights.getRandomSightId'),

    getByUser: async(params: ISightsGetParams): Promise<IApiList<ISight>> =>
        apiRequest('sights.get', params),

    getCounts: async(): Promise<ISiteStats> =>
        apiRequest('sights.getCounts'),

    getRecent: async(params: ISightsGetRecentParams): Promise<IApiList<ISight>> =>
        apiRequest('sights.getRecent', params),

    add: async(params: ISightsAddParams): Promise<{ sightId: number }> =>
        apiRequest('sights.add', params),

    edit: async(params: ISightsEditParams): Promise<boolean> =>
        apiRequest('sights.edit', params),
};
