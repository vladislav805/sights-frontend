import * as React from 'react';
import * as L from 'leaflet';
import './style.scss';
import { MapContainer, Polyline } from 'react-leaflet';
import { mdiMapMarkerPath } from '@mdi/js';
import { ISight } from '../../../api/types/sight';
import { MapTileLayers } from '../../../utils/map-utils';
import { SightMark } from '../../Sight/Map/marks';
import MapConfigurator from '../../../components/MapConfigurator';
import MyLocationButton from '../../../components/MyLocationButton';
import MapControlBox from '../../../components/MapControlBox';
import MapButton from '../../../components/MapButton';
import { IRouteResult } from '../../../api/types/route';
import API from '../../../api';

type Props = {
    items: ISight[];
    abilityRoute: boolean;
};

export const CollectionEntrySightsMap: React.FC<Props> = ({ items, abilityRoute }: Props) => {
    const bounds = new L.LatLngBounds(items.map(sight => [sight.latitude, sight.longitude]));
    const [route, setRoute] = React.useState<IRouteResult>(null);

    const onRouteRequire = React.useMemo(() => () => {
        API.osm.route({
            sightIds: items.map(sight => sight.sightId),
            profile: 'foot',
        }).then(setRoute);
    }, [items]);

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
            {route && (
                <Polyline
                    positions={route.geometry} />
            )}
            <MapControlBox
                horizontal="left"
                vertical="bottom">
                <MyLocationButton />
                {abilityRoute && (
                    <MapButton
                        icon={mdiMapMarkerPath}
                        title="Построить маршрут"
                        onClick={onRouteRequire} />
                )}
            </MapControlBox>
        </MapContainer>
    );
};
