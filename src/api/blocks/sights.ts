import { apiNew, IApiList, ISight, ISiteStats, VisitState } from '../index';

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
    stat: ISightGetVisitState;
};

type ISightGetVisitState = {
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

export const sights = {
    getById: async(params: ISightGetByIdParams): Promise<IApiList<ISight>> =>
        apiNew<IApiList<ISight>>('sights.getById', params),

    setVisitState: async(props: ISightSetVisitStateParams): Promise<ISightSetVisitStateResult> =>
        apiNew<ISightSetVisitStateResult>('sights.setVisitState', props),

    getRandomSightId: async(): Promise<number> =>
        apiNew<number>('sights.getRandomSightId'),

    getByUser: async(params: ISightsGetParams): Promise<IApiList<ISight>> =>
        apiNew('sights.get', params),

    getCounts: async(): Promise<ISiteStats> =>
        apiNew('sights.getCounts'),

    getRecent: async(params: ISightsGetRecentParams): Promise<IApiList<ISight>> =>
        apiNew('sights.getRecent', params),
};
