import { LayersControl, TileLayer } from 'react-leaflet';
import * as React from 'react';
import * as Leaflet from 'leaflet';
import { LatLng, LatLngTuple } from 'leaflet';
import { parseQueryString } from './qs';
import { hostedLocalStorage } from './localstorage';

export const PREF_LAST_CENTER = 'last_center';
export const PREF_LAST_ZOOM = 'last_zoom';
export const PREF_LAYER = 'last_layer';
export const defaultCenter: LatLngTuple = [60, 30];
export const defaultZoom = 9;

const defaultTilesName = 'OpenStreetMap';

type ITileVariant = {
    name: string;
    url: string;
    url2x?: string;
    title: string;
    subdomains: string[];
    copyrights: string;
    maxZoom: number;
};

const tiles: ITileVariant[] = [
    {
        name: 'osm',
        url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        title: defaultTilesName,
        subdomains: ['a', 'b', 'c'],
        copyrights: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
    },
    {
        name: 'gmsh',
        url: 'http://mt{s}.google.com/vt/lyrs=s,h&hl=en&x={x}&y={y}&z={z}&s=Ga',
        title: 'Google Maps Гибрид',
        subdomains: ['0', '1', '2'],
        copyrights: '&copy; <a href="https://google.com/maps">Google Maps</a>',
        maxZoom: 19,
    },
    {
        name: 'gms',
        url: 'http://mt{s}.google.com/vt/lyrs=s&hl=en&x={x}&y={y}&z={z}&s=Ga',
        title: 'Google Maps Спутник',
        subdomains: ['0', '1', '2'],
        copyrights: '&copy; <a href="https://google.com/maps">Google Maps</a>',
        maxZoom: 19,
    },
    {
        name: 'gmm',
        url: 'http://mt{s}.google.com/vt/lyrs=m&hl=en&x={x}&y={y}&z={z}&s=Ga',
        title: 'Google Maps Схема',
        subdomains: ['0', '1', '2'],
        copyrights: '&copy; <a href="https://google.com/maps">Google Maps</a>',
        maxZoom: 19,
    },
    {
        name: 'gmp',
        url: 'http://mt{s}.google.com/vt/lyrs=p&hl=en&x={x}&y={y}&z={z}&s=Ga',
        title: 'Google Maps Terrain',
        subdomains: ['0', '1', '2'],
        copyrights: '&copy; <a href="https://google.com/maps">Google Maps</a>',
        maxZoom: 19,
    },
    {
        name: '2gis',
        url: 'http://tile{s}.maps.2gis.com/tiles?x={x}&y={y}&z={z}',
        url2x: 'http://tile{s}.maps.2gis.com/tiles?x={x}&y={y}&z={z}&ts=online_hd',
        title: '2ГИС',
        subdomains: ['0', '1', '2'],
        copyrights: '&copy; <a href="https://2gis.ru/">2GIS</a>',
        maxZoom: 18,
    },
    {
        name: 'mbs',
        // eslint-disable-next-line max-len
        url: `https://api.mapbox.com/styles/v1/vladislav805/ck95f903f43zw1js9usc7fm3t/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.MAPBOX_ACCESS_TOKEN}`,
        // eslint-disable-next-line max-len
        url2x: `https://api.mapbox.com/styles/v1/vladislav805/ck95f903f43zw1js9usc7fm3t/tiles/256/{z}/{x}/{y}?access_token=${process.env.MAPBOX_ACCESS_TOKEN}`,
        title: 'MapBox Схема',
        subdomains: [],
        copyrights: '&copy; <a href="https://mapbox.com/">Mapbox</a>',
        maxZoom: 19,
    },
    /*
    {
        name: 'ym',
        url: 'http://vec{s}.maps.yandex.net/tiles?l=map&v=4.55.2&z={z}&x={x}&y={y}&scale=2&lang=ru_RU',
        copyrights: '<a href="https://yandex.ru/maps" target="_blank">Яндекс</a>',
        subdomains: ['01', '02', '03', '04'],
        options: {
            crs: Leaflet.CRS.EPSG3395,
        },
    }
    */
];

export const parseCoordinatesFromString = (str: string): LatLngTuple => str?.split(',', 2).map(Number) as LatLngTuple;
export const mapPrefs = hostedLocalStorage('map');

export const MapTileLayers: React.FC = () => {
    const savedLayer = mapPrefs(PREF_LAYER) ?? defaultTilesName;
    const is2x = window.devicePixelRatio > 1;
    return (
        <LayersControl position="topright">
            {tiles.map(tile => (
                <LayersControl.BaseLayer
                    key={tile.name}
                    name={tile.title}
                    checked={tile.title === savedLayer}>
                    <TileLayer
                        maxZoom={tile.maxZoom}
                        attribution={tile.copyrights}
                        url={is2x && tile.url2x ? tile.url2x : tile.url}
                        subdomains={tile.subdomains} />
                </LayersControl.BaseLayer>
            ))}
        </LayersControl>
    );
};

type IDefaultMapPosition = {
    center: LatLngTuple;
    zoom: number;
};

export const getDefaultMapPosition = (fromUrl: boolean): IDefaultMapPosition => {
    let center: LatLngTuple;
    let zoom;

    if (!fromUrl) {
        // Get center and zoom from address if it enabled
        const qs = parseQueryString(window.location.search);
        center = parseCoordinatesFromString(qs.get('c'));
        zoom = +qs.get('z');
    }

    if (!center) {
        // If no one, check last position and default values
        center = parseCoordinatesFromString(mapPrefs(PREF_LAST_CENTER)) ?? defaultCenter;
        zoom = +mapPrefs(PREF_LAST_ZOOM) ?? defaultZoom;
    }

    return { center, zoom };
};

export type IBounds = {
    ne: LatLng;
    sw: LatLng;
};

export const addOverflowToCoordinates = (bounds: IBounds): IBounds => {
    const scaleX = Math.abs(bounds.ne.lat - bounds.sw.lat) * .1;
    const scaleY = Math.abs(bounds.ne.lng - bounds.sw.lng) * .1;

    return {
        ne: {
            lat: bounds.ne.lat + scaleX,
            lng: bounds.ne.lng + scaleY,
        },
        sw: {
            lat: bounds.sw.lat - scaleX,
            lng: bounds.sw.lng - scaleY,
        },
    } as IBounds;
};

export const getBoundsFromMap = (map: Leaflet.Map): IBounds => {
    const bounds = map.getBounds();
    return {
        ne: bounds.getNorthEast(),
        sw: bounds.getSouthWest(),
    };
};
