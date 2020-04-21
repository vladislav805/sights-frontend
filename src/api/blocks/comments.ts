import { IComment, ListWithUsers } from '../types';
import { api } from '..';

export const comments = {
    get: async(sightId: number, count = 30, offset = 0): Promise<ListWithUsers<IComment>> => api('comments.get', { sightId, offset, count }),

    add: async(sightId: number, text: string): Promise<true> => api('comments.add', { sightId, text }),

    remove: async(sightId: number): Promise<true> => api('comments.remove', { sightId }),

    report: async(commentId: number): Promise<true> => api('comments.report', { commentId }),
};
