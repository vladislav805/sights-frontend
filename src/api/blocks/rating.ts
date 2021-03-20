import { ISightRating } from '../types/sight';
import apiRequest from '../request';

type IRatingSetProps = ({ sightId: number; } | { collectionId: number; }) & {
    rating: number;
};

const rating = {
    set: async(params: IRatingSetProps): Promise<ISightRating> =>
        apiRequest('rating.set', params),
};

export default rating;
