import { api, IPhoto, IApiListExtended } from '../index';

export const photos = {
    get: async(sightId: number): Promise<IApiListExtended<IPhoto>> => api('photos.get', { sightId }),

    report: async(sightId: number, photoId: number): Promise<true> => api('photos.report', { sightId, photoId }),
};
