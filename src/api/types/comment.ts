export interface IComment {
    commentId: number;
    userId: number;
    date: number;
    text: string;
    canModify?: boolean;
}
