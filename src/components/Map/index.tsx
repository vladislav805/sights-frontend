import * as React from 'react';
import './leaflet.scss';
import { ContextProps, LayersControl, Map, Marker, TileLayer, Tooltip, withLeaflet } from 'react-leaflet';
import { hostedLocalStorage } from '../../utils/localstorage';
import * as Leaflet from 'leaflet';
import { LatLngTuple } from 'leaflet';
import { getCoordinatesFromMap } from './utils';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { parseQueryString, stringifyQueryString } from '../../utils/qs';
import getIcon, { IIconCreator } from './Icon';

interface IMapProps extends RouteComponentProps<{}>, ContextProps {
    position?: {
        center: LatLngTuple;
        zoom: number;
    };
    onMapReady?: (map: Leaflet.Map) => void;
    onLocationChanged?: (ne: LatLngTuple, sw: LatLngTuple) => void;
    saveLocation?: boolean;
    saveLocationInUrl?: boolean;

    items?: IMapItem[];
    drawItem?: (item: IMapItem) => React.ReactChild;
    onItemClicked?: (item: IMapItem, map: Leaflet.Map) => void;

    onMapClick?: (coordinates: LatLngTuple, map: Leaflet.Map) => void;
}

interface IMapState {
    popupOpened: boolean;
    center: LatLngTuple;
    zoom: number;
}

export interface IMapItem<T = unknown> {
    id: number;
    position: LatLngTuple;
    title: string;
    tooltip?: string;
    description?: string;
    icon?: IIconCreator;
    data?: T;
}

const tiles = [
    {
        name: 'osm',
        url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
        title: 'OpenStreetMap',
        subdomains: [],
        copyrights: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
    },
    {
        name: 'gmsh',
        url: 'http://mt{s}.google.com/vt/lyrs=s,h&hl=en&x={x}&y={y}&z={z}&s=Ga',
        title: 'Google Maps Гибрид',
        subdomains: ['0', '1', '2'],
        copyrights: '&copy; <a href="https://google.com/maps">Google Maps</a>',
    },
    {
        name: 'gms',
        url: 'http://mt{s}.google.com/vt/lyrs=s&hl=en&x={x}&y={y}&z={z}&s=Ga',
        title: 'Google Maps Спутник',
        subdomains: ['0', '1', '2'],
        copyrights: '&copy; <a href="https://google.com/maps">Google Maps</a>',
    },
    {
        name: 'gmm',
        url: 'http://mt{s}.google.com/vt/lyrs=m&hl=en&x={x}&y={y}&z={z}&s=Ga',
        title: 'Google Maps Схема',
        subdomains: ['0', '1', '2'],
        copyrights: '&copy; <a href="https://google.com/maps">Google Maps</a>',
    },
    {
        name: 'gmp',
        url: 'http://mt{s}.google.com/vt/lyrs=p&hl=en&x={x}&y={y}&z={z}&s=Ga',
        title: 'Google Maps Terrarian',
        subdomains: ['0', '1', '2'],
        copyrights: '&copy; <a href="https://google.com/maps">Google Maps</a>',
    },
    {
        name: '2gis',
        url: 'http://tile{s}.maps.2gis.com/tiles?x={x}&y={y}&z={z}',
        title: '2ГИС',
        subdomains: ['0', '1', '2'],
        copyrights: '&copy; <a href="https://2gis.ru/">2GIS</a>',
    },
    {
        name: 'mbs',
        url: 'https://api.mapbox.com/styles/v1/vladislav805/ck95f903f43zw1js9usc7fm3t/tiles/256/{z}/{x}/{y}@2x?access_token=' + process.env.MAPBOX_ACCESS_TOKEN,
        title: 'MapBox Схема',
        subdomains: [],
        copyrights: '&copy; <a href="https://mapbox.com/">Mapbox</a>',
    },
    /*{
        name: 'ym',
        url: 'http://vec{s}.maps.yandex.net/tiles?l=map&v=4.55.2&z={z}&x={x}&y={y}&scale=2&lang=ru_RU',
        copyrights: '<a href="https://yandex.ru/maps" target="_blank">Яндекс</a>',
        subdomains: ['01', '02', '03', '04'],
        options: {
            crs: Leaflet.CRS.EPSG3395,
        },
    }*/
];

const PREF_LAST_CENTER = 'last_center';
const PREF_LAST_ZOOM = 'last_zoom';

const defaultTilesName = 'osm';
const defaultCenter: LatLngTuple = [60, 30];
const defaultZoom = 9;

class MapX extends React.Component<IMapProps, IMapState> {
    static defaultProps: Partial<IMapProps> = {
        saveLocation: true,
    };

    constructor(props: IMapProps) {
        super(props);

        let center: LatLngTuple;
        let zoom;

        if (props.position) {
            // Get center and zoom from props if it specified
            center = props.position.center;
            zoom = props.position.zoom;
        }

        if (!center && this.props.saveLocationInUrl && !props.position) {
            // Get center and zoom from address if it enabled
            const qs = parseQueryString(window.location.search);
            center = this.parseCoordinatesFromString(qs.get('c'));
            zoom = +qs.get('z');
        }

        if (!center) {
            // If no one, check last position and default values
            center = this.parseCoordinatesFromString(this.prefs(PREF_LAST_CENTER)) ?? defaultCenter;
            zoom = +this.prefs(PREF_LAST_ZOOM) ?? defaultZoom;
        }

        this.state = {
            popupOpened: false,
            center,
            zoom,
        };
    }

    private parseCoordinatesFromString = (str: string) => str?.split(',').map(Number) as LatLngTuple;

    private getMap = (): Leaflet.Map => this.mapRef?.current?.leafletElement;

    private prefs = hostedLocalStorage('map');
    private mapRef = React.createRef<Map>();
    private last = { lat: 0, lng: 0 };

    componentDidMount() {
        this.props.onMapReady?.(this.getMap());

        console.log(this.mapRef.current?.leafletElement.options);
    }

    private onViewportChanged = () => { // event: Leaflet.LeafletEvent
    //private onViewportChanged = (viewport: Viewport) => {
        const map = this.getMap();

        const { lat, lng } = map.getCenter();

        const needUpdate = !(lat === this.last.lat && lng === this.last.lng);

        if (this.props.saveLocation) {
            this.prefs(PREF_LAST_CENTER, `${lat},${lng}`);
            this.prefs(PREF_LAST_ZOOM, map.getZoom());
        }

        if (this.props.saveLocationInUrl) {
            // anti pattern :(
            window.history.replaceState(null, null, '?' + stringifyQueryString({
                c: [lat.toFixed(5), lng.toFixed(5)].join(','),
                z: map.getZoom(),
            }))
        }

        if (needUpdate) {
            const {ne, sw} = getCoordinatesFromMap(map);
            this.props.onLocationChanged?.(ne, sw);

            this.last = { lat, lng };
        }
    };

    private markerClickListener = (item: IMapItem) => () => this.props.onItemClicked?.(item, this.getMap());

    private onMapClick = (event: Leaflet.LeafletMouseEvent) => {
        const { lat, lng } = event.latlng;
        const coordinates: LatLngTuple = [lat, lng];
        this.props.onMapClick?.(coordinates, this.getMap());
    };

    render() {
        const { center, zoom } = this.state;
        return (
            <Map
                ref={this.mapRef}
                className="map"
                center={center}
                zoom={zoom}
                onmoveend={this.onViewportChanged}
                onclick={this.onMapClick}>
                <LayersControl position="topright">
                    {tiles.map(({ name, title, url, copyrights, subdomains }) => (
                        <LayersControl.BaseLayer
                            key={name}
                            name={title}
                            checked={name === defaultTilesName}>
                            <TileLayer
                                attribution={copyrights}
                                url={url}
                                subdomains={subdomains} />
                        </LayersControl.BaseLayer>
                    ))}
                </LayersControl>
                {this.props.items?.map(item => (
                    <Marker
                        icon={getIcon(item.icon)}
                        key={item.id}
                        position={item.position}
                        onclick={this.markerClickListener(item)}>
                        {item.tooltip && (<Tooltip>{item.tooltip}</Tooltip>)}
                        {this.props.drawItem(item)}
                    </Marker>
                ))}
                {this.props.children}
            </Map>
        );
    }
}

export default withRouter(withLeaflet(MapX));
