import * as L from 'leaflet';
import { ISight } from '../api/types/sight';
import iconCity from '../assets/marker-city.svg';
import { ICityExtended } from '../api/types/city';

export const getColorizedMarker = (color: string): string => (
    `<svg width="35" height="40" viewBox="-.2 -.43 283 297" xmlns="http://www.w3.org/2000/svg">
<defs>
<filter id="a" x="-.28" y="-.27" width="1.6" height="1.5" color-interpolation-filters="sRGB">
<feFlood flood-color="rgb(0,0,0)" flood-opacity=".5" result="flood"/>
<feComposite in="flood" in2="SourceGraphic" operator="in" result="composite1"/>
<feOffset dx="0" dy="0" result="offset"/>
<feComposite in="offset" in2="offset" operator="atop" result="composite2"/>
<feGaussianBlur stdDeviation="18"/>
</filter>
</defs>
<path transform="matrix(.98 0 0 .93 -1.5 22)" d="m191 147c-41 0-87 24-102 53-2.8 5.5-2.8 5.6-2.6 16 7.6 31 13 63 21
94l117-94c12-12 12-11 14-16 15-29-6.3-53-48-53zm-19 37c13 0 19 7.3 15 16-4.6 9-19 16-31 16-13 0-19-7.3-15-16 4.6-9
19-16 31-16z" fill="#4899d0" filter="url(#a)" stroke-width=".54"/>
<path transform="matrix(8.1 0 0 8.1 0 -13)" d="m13 0c-7.2 0-13 5.8-13 13 0.0057 1.4 0.0071 1.4 1 4 4.1 7.7 7.9 15 12 
23l12-23c0.99-2.8 0.99-2.8 1-4 0-7.2-5.8-13-13-13zm0 9c2.2 1e-7 4 1.8 4 4s-1.8 4-4 4-4-1.8-4-4c1e-7 -2.2 1.8-4 4-4z" 
fill="#${color}" stroke="#${color}" stroke-width=".4"/>
<circle cx="105" cy="92" r="32" fill="#fff" stroke-width="0"/>
</svg>`
);

export const getDataUriSvg = (svg: string): string => `data:image/svg+xml,${encodeURIComponent(svg)}`;

export const getDataUriColorizedMarker = (color: string): string => getDataUriSvg(getColorizedMarker(color));

const sightDefaultProps: L.BaseIconOptions = {
    iconAnchor: [13, 40],
    popupAnchor: [0, -27],
    iconSize: [35, 40],
    tooltipAnchor: [13, -20],
};

export const sightIconRed = new L.Icon({
    ...sightDefaultProps,
    iconUrl: getDataUriColorizedMarker('ff0000'),
});

export const sightIconBlue = new L.Icon({
    ...sightDefaultProps,
    iconUrl: getDataUriColorizedMarker('1e88e5'),
});

export const getIconBySight = (sight: ISight): L.Icon => sightIconBlue;

export const cityFactoryIcon = ({ name, count }: ICityExtended): L.DivIcon => L.divIcon({
    iconSize: [40, 40],
    className: '',
    html: `
<div class="leaflet-marker-icon__text">
    <img src="${iconCity}" class="leaflet-marker-icon leaflet-marker-icon__text-icon leaflet-zoom-animated" alt="" />
    <div class="leaflet-marker-icon__city-count">${count}</div>
    <div class="leaflet-marker-icon__text-text">${name}</div>
</div>`,
});

export const getIconMyLocation = (): L.Icon => new L.Icon({
    // eslint-disable-next-line max-len
    iconUrl: getDataUriSvg('<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><circle r="10" cx="10" cy="10" fill="red" /></svg>'),
    iconAnchor: [10, 10],
    iconSize: [20, 20],
});
