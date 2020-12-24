import { apiRequest } from '../index';
import { INotification } from '../types/notification';
import { IApiList } from '../types/api';

export const notifications = {
    get: async(): Promise<IApiList<INotification>> =>
        apiRequest('notifications.get', { extra: 'photo' }),

    readAll: async(): Promise<true> =>
        apiRequest('notifications.readAll'),
};
