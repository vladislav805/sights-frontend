import * as React from 'react';
import './leaflet.scss';
import { ContextProps, LayersControl, Map, Marker, TileLayer, Tooltip, withLeaflet } from 'react-leaflet';
import { hostedLocalStorage } from '../../utils/localstorage';
import * as Leaflet from 'leaflet';
import { LatLngTuple } from 'leaflet';
import { getCoordinatesFromMap } from './utils';

interface IMapProps {
    onMapReady?: (map: Leaflet.Map) => void;
    onLocationChanged?: (ne: LatLngTuple, sw: LatLngTuple) => void;
    saveLocation?: boolean;

    items?: IMapItem[];
    drawItem?: (item: IMapItem) => React.ReactChild;
    onItemClicked?: (item: IMapItem, map: Leaflet.Map) => void;

    onMapClick?: (coordinates: LatLngTuple, map: Leaflet.Map) => void;
}

interface IMapState {
    popupOpened: boolean;
}

export interface IMapItem<T = unknown> {
    id: number;
    position: LatLngTuple;
    title: string;
    tooltip?: string;
    description?: string;
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
        url: 'https://api.mapbox.com/styles/v1/vladislav805/ck95f903f43zw1js9usc7fm3t/tiles/256/{z}/{x}/{y}?access_token=' + process.env.MAPBOX_ACCESS_TOKEN,
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

class MapX extends React.Component<IMapProps & ContextProps, IMapState> {
    static defaultProps: Partial<IMapProps & ContextProps> = {
        saveLocation: true,
    };

    state: IMapState = {
        popupOpened: false,
    };

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
        const p = this.prefs;
        const center = p(PREF_LAST_CENTER)?.split(',').map(Number) as LatLngTuple ?? defaultCenter;
        return (
            <Map
                ref={this.mapRef}
                className="map"
                center={center}
                zoom={+p(PREF_LAST_ZOOM) ?? defaultZoom}
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
                {this.props.items.map(item => (
                    <Marker
                        key={item.id}
                        position={item.position}
                        onclick={this.markerClickListener(item)}>
                        {item.tooltip && (<Tooltip>{item.tooltip}</Tooltip>)}
                        {this.props.drawItem(item)}
                    </Marker>
                ))}
            </Map>
        );
    }
}

export default withLeaflet(MapX);
