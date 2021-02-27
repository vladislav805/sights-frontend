import { LayersControl, Popup, TileLayer, useMapEvents } from 'react-leaflet';
import * as React from 'react';
import * as Leaflet from 'leaflet';
import { LatLng, LatLngTuple, Map } from 'leaflet';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import { parseQueryString, stringifyQueryString } from './qs';
import { hostedLocalStorage } from './localstorage';
import { ISight } from '../api/types/sight';

const defaultTilesName = 'OpenStreetMap';

const tiles = [
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
        title: '2ГИС',
        subdomains: ['0', '1', '2'],
        copyrights: '&copy; <a href="https://2gis.ru/">2GIS</a>',
        maxZoom: 18,
    },
    {
        name: 'mbs',
        url: 'https://api.mapbox.com/styles/v1/vladislav805/ck95f903f43zw1js9usc7fm3t/tiles/256/{z}/{x}/{y}@2x?access_token=' + process.env.MAPBOX_ACCESS_TOKEN,
        title: 'MapBox Схема',
        subdomains: [],
        copyrights: '&copy; <a href="https://mapbox.com/">Mapbox</a>',
        maxZoom: 19,
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

export const parseCoordinatesFromString = (str: string): LatLngTuple => str?.split(',', 2).map(Number) as LatLngTuple;
const mapPrefs = hostedLocalStorage('map');

export const MapTileLayers: React.FC = () => {
    const savedLayer = mapPrefs(PREF_LAYER) ?? defaultTilesName;
    return (
        <LayersControl position='topright'>
            {tiles.map(({ name, title, url, copyrights, subdomains, maxZoom }) => (
                <LayersControl.BaseLayer
                    key={name}
                    name={title}
                    checked={title === savedLayer}>
                    <TileLayer
                        maxZoom={maxZoom}
                        attribution={copyrights}
                        url={url}
                        subdomains={subdomains} />
                </LayersControl.BaseLayer>
            ))}
        </LayersControl>
    );
};

type IMapControllerProps = Partial<{
    saveLocation: boolean;
    setLocationInAddress: boolean;
    onLocationChanged?(bounds: IBounds, map: Map): unknown;
    needInvalidateSize: boolean;
}>;

const getMainElement = (node: HTMLElement): HTMLElement => {
    while ((node = node.parentElement) !== null) {
        if (node.classList.contains('main-container')) {
            return node;
        }
    }
    return null;
};

/**
 * Настройщик поведения карты
 * @param props
 */
export const MapController: React.FC<IMapControllerProps> = (props: IMapControllerProps) => {
    // noinspection SpellCheckingInspection
    const map = useMapEvents({
        /**
         * При изменении вьюпорта карты, если указано в пропсах
         * - Сохраняем положение карты в localStorage
         * - Меняем адрес
         * - Вызываем колбек (если указан) с переачей вьюпорта и карты
         */
        moveend: () => {
            const { lat, lng } = map.getCenter();

            if (props.saveLocation) {
                mapPrefs(PREF_LAST_CENTER, `${lat},${lng}`);
                mapPrefs(PREF_LAST_ZOOM, String(map.getZoom()));
            }

            if (props.setLocationInAddress) {
                // anti pattern :(
                window.history.replaceState(null, null, '?' + stringifyQueryString({
                    c: [lat.toFixed(5), lng.toFixed(5)].join(','),
                    z: map.getZoom(),
                }))
            }

            props.onLocationChanged?.(getBoundsFromMap(map), map);
        },

        /**
         * При изменении видимого слоя карты сохраняем его
         */
        baselayerchange: event => {
            mapPrefs(PREF_LAYER, event.name);
        },
    });


    React.useEffect(() => {
        /**
         * Исправляет косяк: при увеличении ширины страницы, leaflet рендерит тайлы
         * только для той ширины, которая была при инициализации карты. Здесь же
         * вешаем обработчик за завершение анимации на main-container, обновляем
         * размеры и убираем обработчик
         */
        if (props.needInvalidateSize) {
            /**
             * Колбек, вызываемый при окончании анимации
             */
            let callback = () => {
                // Если колбека уже нет - его сняли
                if (!callback) {
                    return;
                }

                // Меняем размер карты
                map.invalidateSize(true);

                // Сносим колбек
                resetCallback();
            };

            const resetCallback = () => {
                if (callback) {
                    // Убираем обработчик
                    main.removeEventListener('transitionend', callback);
                    // Зачищаем колбек
                    callback = null;
                }
            };

            const main = getMainElement(map.getContainer());
            main.addEventListener('transitionend', callback);

            // Через секунду, если анимация уже произошла - колбек удалился, но
            // если вдруг контейнер не анимировался (например, маленький экран),
            // то transitionend никогда не произойдёт и обработчик события так и
            // будет висеть, Его нужно убрать, если он не выполнился
            setTimeout(() => resetCallback(), 1000);
        }

        map.zoomControl.setPosition('bottomright');
    }, []);

    return (<></>);
};

type IDefaultMapPosition = {
    center: LatLngTuple;
    zoom: number;
};

export const PREF_LAST_CENTER = 'last_center';
export const PREF_LAST_ZOOM = 'last_zoom';
export const PREF_LAYER = 'last_layer';
export const defaultCenter: LatLngTuple = [60, 30];
export const defaultZoom = 9;

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

type ISightPopupProps = {
    sight: ISight;
};

export const SightPopup: React.FC<ISightPopupProps> = ({ sight }: ISightPopupProps) => {
    const { sightId, title, description, photo } = sight;
    return (
        <Popup
            minWidth={280}
            autoPan={false}
            closeOnEscapeKey
            closeButton>
            <div
                className={classNames('map-sight-popup', {
                    'map-sight-popup__withPhoto': !!photo,
                })}>
                {photo && (
                    <Link
                        className="map-sight-popup--photo"
                        to={`/sight/${sightId}`}
                        target="_blank"
                        rel="noopener noreferrer">
                        <img
                            src={photo.photo200}
                            alt="Photo" />
                    </Link>
                )}
                <div className="map-sight-popup--content">
                    <h4 className="map-sight-popup--title">
                        <Link
                            to={`/sight/${sightId}`}
                            target="_blank"
                            rel="noopener noreferrer">
                            {title}
                        </Link>
                    </h4>
                    <p className="map-sight-popup--description">{description}</p>
                </div>
            </div>
        </Popup>
    );
};

