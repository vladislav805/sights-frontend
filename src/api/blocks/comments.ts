import { apiRequest } from '..';
import { IApiListExtended } from '../types/api';
import { IComment } from '../types/comment';

type ICommentsGetParams = {
    sightId: number;
    count?: number;
    offset?: number;
    fields?: string[];
};

type ICommentsAddParams = {
    sightId: number;
    text: string;
};

export const comments = {
    get: async(params: ICommentsGetParams): Promise<IApiListExtended<IComment>> =>
        apiRequest('comments.get', params),

    add: async(params: ICommentsAddParams): Promise<IComment> =>
        apiRequest('comments.add', params),

    remove: async(commentId: number): Promise<true> =>
        apiRequest('comments.remove', { commentId }),

    report: async(commentId: number): Promise<true> =>
        apiRequest('comments.report', { commentId }),
};
