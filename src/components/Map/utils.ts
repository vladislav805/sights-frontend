import * as Leaflet from 'leaflet';
import { LatLngTuple } from 'leaflet';

export const getCoordinatesFromMap = (map: Leaflet.Map): {
    ne: LatLngTuple;
    sw: LatLngTuple;
} => {
    const bounds = map.getBounds();

    const { lat: NElat, lng: NElng } = bounds.getNorthEast();
    const { lat: SWlat, lng: SWlng } = bounds.getSouthWest();

    return {
        ne: [NElat, NElng],
        sw: [SWlat, SWlng],
    };
};
