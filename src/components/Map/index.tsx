import * as React from 'react';
import './leaflet.scss';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import { MapContainer, Marker, Tooltip, useMapEvents } from 'react-leaflet';
import { hostedLocalStorage } from '../../utils/localstorage';
import * as Leaflet from 'leaflet';
import { LatLng, LatLngTuple } from 'leaflet';
import { RouteComponentProps } from 'react-router-dom';
import { stringifyQueryString } from '../../utils';
import getIcon, { IIconCreator } from './Icon';
import { getCoordinatesFromMap, IBounds, PREF_LAST_CENTER, PREF_LAST_ZOOM } from '../../utils/map-utils';

type IMapProps = React.PropsWithChildren<RouteComponentProps & {
    position?: {
        center: LatLngTuple;
        zoom: number;
    };
    onMapReady?(map: Leaflet.Map): never;
    onLocationChanged?(bounds: IBounds): never;
    saveLocation?: boolean;
    saveLocationInUrl?: boolean;
    clusterize?: boolean;

    items?: IMapItem[];
    drawItem?: (item: IMapItem) => React.ReactChild;
    onItemClicked?: (item: IMapItem, map: Leaflet.Map) => void;

    onMapClick?: (coordinates: LatLngTuple, map: Leaflet.Map) => void;
}>;

export interface IMapItem<T = unknown> {
    id: number;
    position: LatLngTuple;
    title: string;
    tooltip?: string;
    description?: string;
    icon?: IIconCreator;
    data?: T;
}

const prefs = (key: string, value?: string) => hostedLocalStorage('map')(key, value);

const MapX: React.FC<IMapProps> = (props: IMapProps) => {
    //const [popupOpened, setPopupOpened] = React.useState<boolean>(false);
    const [lastCenter, setLastCenter] = React.useState<LatLng>();

    React.useEffect(() => {
        /*let center: LatLngTuple;
        let zoom;

        if (props.position) {
            // Get center and zoom from props if it specified
            center = props.position.center;
            zoom = props.position.zoom;
        }

        if (!center && props.saveLocationInUrl && !props.position) {
            // Get center and zoom from address if it enabled
            const qs = parseQueryString(window.location.search);
            center = parseCoordinatesFromString(qs.get('c'));
            zoom = +qs.get('z');
        }

        if (!center) {
            // If no one, check last position and default values
            center = parseCoordinatesFromString(prefs(PREF_LAST_CENTER)) ?? defaultCenter;
            zoom = +prefs(PREF_LAST_ZOOM) ?? defaultZoom;
        }

        setCenter(center);
        setZoom(zoom);*/
    }, []);

    const whenCreated = (map: Leaflet.Map) => props.onMapReady?.(map);

    const onViewportChanged = () => { // event: Leaflet.LeafletEvent
        const { lat, lng } = map.getCenter();

        const needUpdate = lastCenter && !(lat === lastCenter.lat && lng === lastCenter.lng);

        if (props.saveLocation) {
            prefs(PREF_LAST_CENTER, `${lat},${lng}`);
            prefs(PREF_LAST_ZOOM, String(map.getZoom()));
        }

        if (props.saveLocationInUrl) {
            // anti pattern :(
            window.history.replaceState(null, null, '?' + stringifyQueryString({
                c: [lat.toFixed(5), lng.toFixed(5)].join(','),
                z: map.getZoom(),
            }))
        }

        if (needUpdate) {
            props.onLocationChanged?.(getCoordinatesFromMap(map));

            setLastCenter({ lat, lng } as LatLng);
        }
    };

    const onMapClick = (event: Leaflet.LeafletMouseEvent) => {
        const { lat, lng } = event.latlng;
        const coordinates: LatLngTuple = [lat, lng];
        props.onMapClick?.(coordinates, map);
    };

    const map = useMapEvents({
        moveend: onViewportChanged,
        click: onMapClick
    });

    const markerClickListener = (item: IMapItem) => () => props.onItemClicked?.(item, map);
    const items = props.items?.map(item => (
        <Marker
            key={item.id}
            icon={getIcon(item.icon || { type: 'sightDefault' })}
            position={item.position}
            eventHandlers={{
                click: markerClickListener(item),
            }}>
            {item.tooltip && (<Tooltip>{item.tooltip}</Tooltip>)}
            {props.drawItem?.(item)}
        </Marker>
    ));

    return (
        <MapContainer
            className="map"
            center={[0, 0]}
            zoom={1}
            whenCreated={whenCreated}>
            {props.clusterize ? (
                <MarkerClusterGroup>
                    {items}
                </MarkerClusterGroup>
            ) : items}
            {props.children}
        </MapContainer>
    );
}

MapX.defaultProps = {
    saveLocation: true,
};

//export default withRouter(MapX);
