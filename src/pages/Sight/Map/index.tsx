import * as React from 'react';
import './style.scss';
import * as Leaflet from 'leaflet';
import * as haversineDistance from 'haversine-distance';
import API, { ICity, ISight } from '../../../api';
import { MapContainer } from 'react-leaflet';
import {
    addOverflowToCoordinates,
    getCoordinatesFromMap,
    getDefaultMapPosition,
    MapController,
    MapTileLayers,
} from '../../../utils/map-utils';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import { CLASS_COMPACT, CLASS_WIDE, withClassBody } from '../../../hoc';
import { CityMark, SightMark } from './marks';
import MapFilters from './filter-menu';
import { SightListFilter, SightListFilterRemote } from './filters';

const MapPage: React.FC = () => {
    const { center: defaultCenter, zoom: defaultZoom } = getDefaultMapPosition(true);
    const [sights, setSights] = React.useState<ISight[]>(null);
    const [cities, setCities] = React.useState<ICity[]>(null);
    const [overMore, setOverMore] = React.useState<boolean>(false);
    const [appliedFilters, setFilters] = React.useState<SightListFilter[]>([]);
    const [map, setMap] = React.useState<Leaflet.Map>();

    const onMapReady = (map: Leaflet.Map) => {
        setMap(map);
        void load(map);
    };

    const load = async(localMap: Leaflet.Map = map) => {
        const bounds = getCoordinatesFromMap(localMap);
        const { ne, sw } = addOverflowToCoordinates(bounds);

        const isSights = haversineDistance(bounds.ne, bounds.sw) < 20000 || localMap.getZoom() >= 11;

        if (isSights) {
            const filters = appliedFilters
                .filter(filter => filter.type === 'remote')
                .map((filter: SightListFilterRemote) => filter.value);

            const { items } = await API.map.getSights({
                topLeft: [ne.lat, ne.lng],
                bottomRight: [sw.lat, sw.lng],
                fields: ['photo', 'visitState'],
                count: 401,
                filters,
            });

            setSights(items);
            setCities(null);
            setOverMore(items.length === 401);
        } else {
            const onlyImportant = localMap.getZoom() <= 7;
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

    React.useEffect(() => {
        map && load();
    }, [appliedFilters]);

    return (
        <div className="pageMap">
            <MapContainer
                className="map"
                center={defaultCenter}
                zoom={defaultZoom}
                whenCreated={onMapReady}>
                <MapTileLayers />
                {cities !== null && cities.map(item => (<CityMark key={-item.cityId} item={item} />))}
                <MarkerClusterGroup maxClusterRadius={55}>
                    {sights !== null && sights.map(item => (<SightMark key={item.sightId} item={item} />))}
                </MarkerClusterGroup>
                <MapController
                    saveLocation={true}
                    setLocationInAddress={true}
                    onLocationChanged={() => load()} />
                <div className="leaflet-bottom leaflet-right">
                    <div className="leaflet-control leaflet-bar">
                        {overMore && 'показаны не все элементы. Для того, чтобы увидеть больше - приблизьте.'}
                    </div>
                </div>
            </MapContainer>
            <MapFilters
                onChangeFilters={setFilters} />
        </div>
    );
}

export default withClassBody([CLASS_COMPACT, CLASS_WIDE])(MapPage);
