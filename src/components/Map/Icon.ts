import * as L from 'leaflet';
import * as iconSightDefault from '../../assets/marker-sight-default.svg';
import * as iconCity from '../../assets/marker-city.svg';
import { divIcon } from 'leaflet';

// eslint-disable-next-line
const getImage = (path: any): string => path.default.replace('..', '/static');

const sightDefault = () => new L.Icon({
    iconUrl: getImage(iconSightDefault),
    iconAnchor: [13, 40],
    popupAnchor: [0, -27],
    iconSize: [35, 40],
    tooltipAnchor: [13, -20],
});

type ICityProps = {
    name: string;
    count: number;
};
const city: IconCreator<ICityProps> = ({ name, count }) => divIcon({
    iconSize: [40, 40],
    className: '',
    html: `
<div class="leaflet-marker-icon__text">
    <img src="${getImage(iconCity)}" class="leaflet-marker-icon leaflet-marker-icon__text-icon leaflet-zoom-animated" alt="" />
    <div class="leaflet-marker-icon__city-count">${count}</div>
    <div class="leaflet-marker-icon__text-text">${name}</div>
</div>`,
});


type IconCreator<T = unknown> = (args: T) => L.Icon | L.DivIcon;

const icons: Record<string, IconCreator> = {
    sightDefault,
    city,
};

export type IIconCreator = {
    type: MarkerIcon;
    [key: string]: string | number;
};

export type MarkerIcon = keyof typeof icons;

export default ({ type, ...args }: IIconCreator) => icons[type](args);
