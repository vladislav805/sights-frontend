import { IApiListExtended, IComment } from '../types';
import { apiNew } from '..';

export const comments = {
    get: async(sightId: number, count = 30, offset = 0): Promise<IApiListExtended<IComment>> => apiNew('comments.get', {
        sightId,
        offset,
        count,
        fields: 'ava',
    }),

    add: async(sightId: number, text: string): Promise<IComment> => apiNew('comments.add', { sightId, text }),

    remove: async(commentId: number): Promise<true> => apiNew('comments.remove', { commentId }),

    report: async(commentId: number): Promise<true> => apiNew('comments.report', { commentId }),
};
