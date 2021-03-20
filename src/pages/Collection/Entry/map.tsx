import * as React from 'react';
import * as L from 'leaflet';
import './style.scss';
import { MapContainer } from 'react-leaflet';
import { ISight } from '../../../api/types/sight';
import { MapTileLayers } from '../../../utils/map-utils';
import { SightMark } from '../../Sight/Map/marks';
import MapConfigurator from '../../../components/MapConfigurator';

type Props = {
    items: ISight[];
};

export const CollectionEntrySightsMap: React.FC<Props> = ({ items }: Props) => {
    const bounds = new L.LatLngBounds(items.map(sight => [sight.latitude, sight.longitude]));
    return (
        <MapContainer
            className="collection-entry--map"
            bounds={bounds}
            scrollWheelZoom={false}
            style={{ height: '500px' }}>
            <MapTileLayers />
            <MapConfigurator
                saveLocation={false}
                setLocationInAddress={false} />
            {items.map(sight => (
                <SightMark
                    key={sight.sightId}
                    item={sight} />
            ))}
        </MapContainer>
    );
};
