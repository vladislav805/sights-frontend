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

type ICommentsRemoveParams = {
    commentId: number;
};

type ICommentsReportParams = {
    commentId: number;
};

export const comments = {
    get: async(params: ICommentsGetParams): Promise<IApiListExtended<IComment>> =>
        apiRequest('comments.get', params),

    add: async(params: ICommentsAddParams): Promise<IComment> =>
        apiRequest('comments.add', params),

    remove: async(params: ICommentsRemoveParams): Promise<true> =>
        apiRequest('comments.remove', params),

    report: async(params: ICommentsReportParams): Promise<true> =>
        apiRequest('comments.report', params),
};
