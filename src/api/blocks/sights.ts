import { api } from '../index';

export const sights = {
    getRandomSightId: async(): Promise<number> => api('sights.getRandomSightId'),
};
