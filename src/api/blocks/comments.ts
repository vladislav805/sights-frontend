import { IComment, IUser, IApiListExtended } from '../types';
import { api } from '..';

type ICommentAddResult = {
    comment: IComment;
    user: IUser;
};

export const comments = {
    get: async(sightId: number, count = 30, offset = 0): Promise<IApiListExtended<IComment>> => api('comments.get', { sightId, offset, count }),

    add: async(sightId: number, text: string): Promise<ICommentAddResult> => api('comments.add', { sightId, text }),

    remove: async(commentId: number): Promise<true> => api('comments.remove', { commentId }),

    report: async(commentId: number): Promise<true> => api('comments.report', { commentId }),
};
