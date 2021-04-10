export type IRouteResult = {
    geometry: Coordinate[];
    distance: number;
    duration: number;
    parts: {
        distance: number;
        duration: number;
    }[];
};

type Coordinate = [number, number];

export type RouteProfile = 'car' | 'bike' | 'foot';
