import * as React from 'react';
import './style.scss';
import { CLASS_COMPACT, CLASS_WIDE, withClassBody } from '../../../hoc';
import API, { ICity, ISight } from '../../../api';
import * as Leaflet from 'leaflet';
import * as haversineDistance from 'haversine-distance';
import { MapContainer, Marker, useMap } from 'react-leaflet';
import {
    addOverflowToCoordinates, getCoordinatesFromMap,
    getDefaultMapPosition,
    IBounds,
    MapController,
    MapTileLayers,
    SightPopup,
} from '../../../utils/map-utils';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import getIcon, { getIconBySight } from '../../../components/Map/Icon';

const SightMark: React.FC<{ item: ISight }> = ({ item }: { item: ISight }) => (
    <Marker
        position={[item.latitude, item.longitude]}
        icon={getIconBySight(item)()}
        title={item.title}>
        <SightPopup sight={item} />
    </Marker>
);

const cityZoom = [
    [15000, 11],
    [10000, 12],
    [5000, 13],
    [2000, 14],
    [1000, 15],
];
const getZoomCity = (city: ICity): number => {
    for (const [radius, zoom] of cityZoom) {
        if (city.radius > radius) {
            return zoom;
        }
    }

    return 14;
};

const CityMark: React.FC<{ item: ICity }> = ({ item }: { item: ICity }) => {
    const map = useMap();

    const events = React.useMemo(() => {
        const zoom = getZoomCity(item);
        console.log(item, zoom);
        return ({
            click: () => map.flyTo([item.latitude, item.longitude], zoom),
        });
    }, [item.cityId]);

    const icon = React.useMemo(
        () => getIcon({ type: 'city', name: item.name, count: item.count }),
        [item.cityId],
    );

    return (
        <Marker
            position={[item.latitude, item.longitude]}
            icon={icon}
            title={item.name}
            eventHandlers={events}>
        </Marker>
    );
};


const MapPage: React.FC = () => {
    const onMapReady = (map: Leaflet.Map) => {
        const { ne, sw } = getCoordinatesFromMap(map);
        void load({ ne, sw }, map);
    };

    const load = async(bounds: IBounds, map: Leaflet.Map) => {
        const { ne, sw } = addOverflowToCoordinates(bounds);

        const isSights = haversineDistance(bounds.ne, bounds.sw) < 20000 || map.getZoom() >= 11;

        if (isSights) {
            const { items } = await API.map.getSights([ne.lat, ne.lng], [sw.lat, sw.lng], ['photo']);
            setSights(items);
            setCities(null);
        } else {
            const onlyImportant = map.getZoom() <= 7;
            let { items } = await API.map.getCities([ne.lat, ne.lng], [sw.lat, sw.lng]);

            if (onlyImportant) {
                items = items.filter(city => !city.parentId);
            }

            setCities(items);
            setSights(null);
        }
    };

    const { center: defaultCenter, zoom: defaultZoom } = getDefaultMapPosition(true);
    const [sights, setSights] = React.useState<ISight[]>(null);
    const [cities, setCities] = React.useState<ICity[]>(null);

    return (
        <MapContainer
            className="map"
            center={defaultCenter}
            zoom={defaultZoom}
            whenCreated={onMapReady}>
            <MapTileLayers />
            {cities !== null && cities.map(item => (<CityMark key={-item.cityId} item={item} />))}
            <MarkerClusterGroup maxClusterRadius={60}>
                {sights !== null && sights.map(item => (<SightMark key={item.sightId} item={item} />))}
            </MarkerClusterGroup>
            <MapController
                saveLocation={true}
                setLocationInAddress={true}
                onLocationChanged={(bounds, map) => load(bounds, map)} />
        </MapContainer>
    );
}

export default withClassBody([CLASS_COMPACT, CLASS_WIDE])(MapPage);
