import { ISight, VisitState } from '../types/sight';
import { IApiList } from '../types/api';
import { apiRequest } from '..';
import { ISiteStats } from '../local-types';

type SightsFields =
    | 'author'
    | 'photo'
    | 'city'
    | 'tags'
    | 'visitState'
    | 'rating';

type ISightGetByIdParams = {
    sightIds: number | number[];
    fields?: SightsFields[];
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
    fields?: SightsFields[];
};

type ISightsGetRecentParams = {
    count?: number;
    fields?: SightsFields[];
};

type ISightsSearchParams = {
    query?: string;
    cityId?: number;
    categoryId?: number;
    fields?: SightsFields[];
    filters?: string | string[];
    count?: number;
    offset?: number;
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

type ISightsSetPhotosParams = {
    sightId: number;
    photoIds: number[];
};

type ISightsRemoveParams = {
    sightId: number;
};

type ISightsSetMaskParams = {
    sightId: number;
    mask: number;
};

type ISightsReportParams = {
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

    search: async(params: ISightsSearchParams): Promise<IApiList<ISight>> =>
        apiRequest('sights.search', params),

    add: async(params: ISightsAddParams): Promise<{ sightId: number }> =>
        apiRequest('sights.add', params),

    edit: async(params: ISightsEditParams): Promise<boolean> =>
        apiRequest('sights.edit', params),

    setPhotos: async(params: ISightsSetPhotosParams): Promise<boolean> =>
        apiRequest('sights.setPhotos', params),

    remove: async(params: ISightsRemoveParams): Promise<boolean> =>
        apiRequest('sights.remove', params),

    setMask: async(params: ISightsSetMaskParams): Promise<boolean> =>
        apiRequest('sights.setMask', params),

    report: async(params: ISightsReportParams): Promise<boolean> =>
        apiRequest('sights.report', params),
};
