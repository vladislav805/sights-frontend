export interface INotification {
    eventId: number;
    date: number;
    type: NotificationType;
    ownerUserId?: number;
    actionUserId?: number;
    subjectId?: number;
    isNew: boolean;
}

export const enum NotificationType {
    SIGHT_VERIFIED = 1,
    COMMENT_ADDED = 8,
    SIGHT_ARCHIVED = 12,
    SIGHT_RATING_CHANGED = 14, // and 15
}
