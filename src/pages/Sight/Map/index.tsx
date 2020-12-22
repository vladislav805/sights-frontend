import * as React from 'react';
import './style.scss';
import API, { ICity, ISight } from '../../../api';
import * as Leaflet from 'leaflet';
import * as haversineDistance from 'haversine-distance';
import { MapContainer, Marker, useMap } from 'react-leaflet';
import {
    addOverflowToCoordinates,
    getCoordinatesFromMap,
    getDefaultMapPosition,
    IBounds,
    MapController,
    MapTileLayers,
    SightPopup,
} from '../../../utils/map-utils';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import getIcon, { getIconBySight } from '../../../components/Map/Icon';
import { CLASS_COMPACT, CLASS_WIDE, withClassBody } from '../../../hoc';

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

    const events = React.useMemo(() => ({
        click: () => map.flyTo([item.latitude, item.longitude], getZoomCity(item)),
    }), [item.cityId]);

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
            const { items } = await API.map.getSights({
                topLeft: [ne.lat, ne.lng],
                bottomRight: [sw.lat, sw.lng],
                fields: ['photo'],
                count: 401,
            });
            setSights(items);
            setCities(null);
            setOverMore(items.length === 401);
        } else {
            const onlyImportant = map.getZoom() <= 7;
            const { items } = await API.map.getCities({
                topLeft: [ne.lat, ne.lng],
                bottomRight: [sw.lat, sw.lng],
                count: 201,
                onlyImportant,
            });

            setCities(items);
            setSights(null);
            setOverMore(items.length === 201);
        }
    };

    const { center: defaultCenter, zoom: defaultZoom } = getDefaultMapPosition(true);
    const [sights, setSights] = React.useState<ISight[]>(null);
    const [cities, setCities] = React.useState<ICity[]>(null);
    const [overMore, setOverMore] = React.useState<boolean>(false);

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
            <div className="leaflet-bottom leaflet-right">
                <div className="leaflet-control leaflet-bar">
                    {overMore && 'показаны не все элементы. Для того, чтобы увидеть больше - приблизьте.'}
                </div>
            </div>
        </MapContainer>
    );
}

export default withClassBody([CLASS_COMPACT, CLASS_WIDE])(MapPage);
