import { IEventList } from '../types';
import { api } from '../index';

export const notifications = {
    get: async(): Promise<IEventList> => api('events.get', { extra: 'photo' }),

    readAll: async(): Promise<true> => api('events.readAll'),
};
