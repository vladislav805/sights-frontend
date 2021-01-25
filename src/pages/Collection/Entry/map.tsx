import * as React from 'react';
import * as L from 'leaflet';
import './style.scss';
import { ISight } from '../../../api/types/sight';
import { MapContainer } from 'react-leaflet';
import { MapController, MapTileLayers } from '../../../utils/map-utils';
import { SightMark } from '../../Sight/Map/marks';

type Props = {
    items: ISight[];
};

export const CollectionEntrySightsMap: React.FC<Props> = (props: Props) => {
    const bounds = new L.LatLngBounds(props.items.map(sight => [sight.latitude, sight.longitude ]));
    return (
        <MapContainer
            className="collection-entry--map"
            bounds={bounds}
            scrollWheelZoom={false}
            style={{ height: '500px' }}>
            <MapTileLayers />
            <MapController
                saveLocation={false}
                setLocationInAddress={false} />
            {props.items.map(sight => (
                <SightMark
                    key={sight.sightId}
                    item={sight} />
            ))}
        </MapContainer>
    );
};
