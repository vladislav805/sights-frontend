import * as React from 'react';
import './leaflet.scss';
import { Map, TileLayer, LayersControl, withLeaflet, ContextProps, Rectangle, Marker, Popup, Viewport, Tooltip } from 'react-leaflet';
import { hostedLocalStorage } from '../../utils/localstorage';
import { LatLngTuple } from 'leaflet';
import * as Leaflet from 'leaflet';
import { getCoordinatesFromMap } from './utils';
import { ICity, ISight } from '../../api';
import SightLayout from './SightLayout';

interface IMapProps<T = unknown> {
    onMapReady?: (map: Leaflet.Map) => void;
    onLocationChanged?: (ne: LatLngTuple, sw: LatLngTuple) => void;
    saveLocation?: boolean;
    debugRect?: boolean;

    items: T[];
    drawItem: (item: T) => React.ReactChild;
}

interface IMapState {
    popupOpened: boolean;
    __rect?: [LatLngTuple, LatLngTuple];
}

const defaultName = 'osm';
const tiles = [
    {
        name: 'osm',
        url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        title: 'OpenStreetMap',
        copyrights: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
    },
    {
        name: 'gms',
        url: 'http://mt0.google.com/vt/lyrs=m&hl=en&x={x}&y={y}&z={z}&s=Ga',
        title: 'Google Maps Schema',
        copyrights: '&copy; Google Maps',
    },
    {
        name: 'gmt',
        url: 'http://mt0.google.com/vt/lyrs=s&hl=en&x={x}&y={y}&z={z}&s=Ga',
        title: 'Google Maps Satellite',
        copyrights: '&copy; Google Maps',
    },
];

const PREF_LAST_CENTER = 'last_center';
const PREF_LAST_ZOOM = 'last_zoom';

class MapX extends React.Component<IMapProps & ContextProps, IMapState> {
    static defaultProps: Partial<IMapProps & ContextProps> = {
        saveLocation: true,
    };

    state: IMapState = {
        popupOpened: false,
        __rect: null,
    };

    private prefs = hostedLocalStorage('map');
    private mapRef = React.createRef<Map>();
    private last = { lat: 0, lng: 0 };

    componentDidMount() {
        this.props.onMapReady?.(this.mapRef?.current?.leafletElement);
    }

    private onViewportChanged = (event: Leaflet.LeafletEvent) => {
    //private onViewportChanged = (viewport: Viewport) => {
        const map = this.mapRef.current?.leafletElement;

        const { lat, lng } = map.getCenter();

        const needUpdate = !(lat === this.last.lat && lng === this.last.lng);

        if (this.props.saveLocation) {

            this.prefs(PREF_LAST_CENTER, `${lat},${lng}`);
            this.prefs(PREF_LAST_ZOOM, map.getZoom());
        }

        if (needUpdate) {
            const {ne, sw} = getCoordinatesFromMap(map);
            this.props.onLocationChanged?.(ne, sw);

            this.last = { lat, lng };
        }
    }

    private onPopupOpen = () => this.setState({ popupOpened: true });
    private onPopupClose = () => this.setState({ popupOpened: false });

    render() {
        const p = this.prefs;
        const center = p(PREF_LAST_CENTER)?.split(',').map(Number) as LatLngTuple ?? [60, 30];
        return (
            <Map
                ref={this.mapRef}
                className="map"
                center={center}
                zoom={+p(PREF_LAST_ZOOM) || 10}
                onmoveend={this.onViewportChanged}>
                <LayersControl position="topright">
                    {tiles.map(({ name, title, url, copyrights }) => (
                        <LayersControl.BaseLayer key={title} name={title} checked={name === defaultName}>
                            <TileLayer
                                attribution={copyrights}
                                url={url} />
                        </LayersControl.BaseLayer>
                    ))}
                </LayersControl>
                {this.props.children}
                {this.props.items.map(this.props.drawItem)}
                {this.props.debugRect && this.state.__rect && (
                    <Rectangle bounds={this.state.__rect} fillColor="red" fillOpacity={.5} />
                )}
            </Map>
        );
    }
}

export default withLeaflet(MapX);
