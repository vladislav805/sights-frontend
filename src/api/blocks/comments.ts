import apiRequest from '../request';
import { IApiListExtended } from '../types/api';
import { IComment } from '../types/comment';

type ICommentSource = { sightId: number; } | { collectionId: number; };

type ICommentsGetParams = ICommentSource & {
    count?: number;
    offset?: number;
    fields?: string[];
};

type ICommentsAddParams = ICommentSource & {
    sightId: number;
    text: string;
};

type ICommentsRemoveParams = {
    commentId: number;
};

type ICommentsReportParams = {
    commentId: number;
};

const comments = {
    get: async(params: ICommentsGetParams): Promise<IApiListExtended<IComment>> =>
        apiRequest('comments.get', params),

    add: async(params: ICommentsAddParams): Promise<IComment> =>
        apiRequest('comments.add', params),

    remove: async(params: ICommentsRemoveParams): Promise<true> =>
        apiRequest('comments.remove', params),

    report: async(params: ICommentsReportParams): Promise<true> =>
        apiRequest('comments.report', params),
};

export default comments;
