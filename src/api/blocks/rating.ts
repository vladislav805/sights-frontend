import { ISightRating } from '../types/sight';
import { apiRequest } from '../index';

type IRatingSetProps = ({ sightId: number; } | { collectionId: number; }) & {
    rating: number;
};

export const rating = {
    set: async(params: IRatingSetProps): Promise<ISightRating> =>
        apiRequest('rating.set', params),
};
