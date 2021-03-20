import apiRequest from '../request';
import { INotification } from '../types/notification';
import { IApiList } from '../types/api';

const notifications = {
    get: async(): Promise<IApiList<INotification>> =>
        apiRequest('notifications.get', { extra: 'photo' }),

    readAll: async(): Promise<true> =>
        apiRequest('notifications.readAll'),
};

export default notifications;
