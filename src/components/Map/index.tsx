import * as React from 'react';
import './leaflet.scss';
import { ContextProps, LayersControl, Map, Marker, TileLayer, Tooltip, withLeaflet } from 'react-leaflet';
import { hostedLocalStorage } from '../../utils/localstorage';
import * as Leaflet from 'leaflet';
import { LatLngTuple } from 'leaflet';
import { getCoordinatesFromMap } from './utils';
import { IPoint } from '../../api';

interface IMapProps {
    onMapReady?: (map: Leaflet.Map) => void;
    onLocationChanged?: (ne: LatLngTuple, sw: LatLngTuple) => void;
    saveLocation?: boolean;

    items: IMapItem[];
    drawItem: (item: IMapItem) => React.ReactChild;
    onItemClicked?: (map: Leaflet.Map, item: IMapItem) => void;
}

interface IMapState {
    popupOpened: boolean;
//    __rect?: [LatLngTuple, LatLngTuple];
}

export interface IMapItem {
    id: number;
    position: LatLngTuple;
    title: string;
    tooltip?: string;
    description?: string;
}

const defaultName = 'osm';
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
        title: 'Google Maps Hybrid',
        subdomains: ['0', '1', '2'],
        copyrights: '&copy; Google Maps',
    },
    {
        name: 'gms',
        url: 'http://mt{s}.google.com/vt/lyrs=s&hl=en&x={x}&y={y}&z={z}&s=Ga',
        title: 'Google Maps Satellite',
        subdomains: ['0', '1', '2'],
        copyrights: '&copy; Google Maps',
    },

    {
        name: 'gmm',
        url: 'http://mt{s}.google.com/vt/lyrs=m&hl=en&x={x}&y={y}&z={z}&s=Ga',
        title: 'Google Maps Streets',
        subdomains: ['0', '1', '2'],
        copyrights: '&copy; Google Maps',
    },
    {
        name: 'gmp',
        url: 'http://mt{s}.google.com/vt/lyrs=p&hl=en&x={x}&y={y}&z={z}&s=Ga',
        title: 'Google Maps Terrarian',
        subdomains: ['0', '1', '2'],
        copyrights: '&copy; Google Maps',
    },
    {
        name: '2gis',
        url: 'http://tile{s}.maps.2gis.com/tiles?x={x}&y={y}&z={z}',
        title: '2gis',
        subdomains: ['0', '1', '2'],
        copyrights: '2gis'
    }
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

class MapX<T extends IPoint> extends React.Component<IMapProps & ContextProps, IMapState> {
    static defaultProps: Partial<IMapProps & ContextProps> = {
        saveLocation: true,
    };

    state: IMapState = {
        popupOpened: false,
//        __rect: null,
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
    }

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
                    {tiles.map(({ name, title, url, copyrights, subdomains }) => (
                        <LayersControl.BaseLayer
                            key={name}
                            name={title}
                            checked={name === defaultName}>
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
                        onclick={() => this.props.onItemClicked?.(this.getMap(), item)}>
                        {item.tooltip && (<Tooltip>{item.tooltip}</Tooltip>)}
                        {this.props.drawItem(item)}
                    </Marker>
                ))}
                { /* this.props.debugRect && this.state.__rect && (<Rectangle bounds={this.state.__rect} fillColor="red" fillOpacity={.5} />) */ }
            </Map>
        );
    }
}

export default withLeaflet(MapX);
