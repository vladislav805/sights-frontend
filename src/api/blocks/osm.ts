import apiRequest from '../request';
import { IRouteResult, RouteProfile } from '../types/route';

type IOsmRouteParams = {
    sightIds: number[];
    profile: RouteProfile;
};

const osm = {
    route: async(params: IOsmRouteParams): Promise<IRouteResult> =>
        apiRequest<IRouteResult>('osm.route', params),
};

export default osm;
