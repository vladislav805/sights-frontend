import * as React from 'react';
import { Marker, Tooltip, useMap } from 'react-leaflet';
import getIcon, { getIconBySight } from '../../../components/Map/Icon';
import { SightPopup } from '../../../utils/map-utils';
import { ISight } from '../../../api/types/sight';
import { ICityExtended } from '../../../api/types/city';

export const SightMark: React.FC<{ item: ISight }> = ({ item }: { item: ISight }) => (
    <Marker
        position={[item.latitude, item.longitude]}
        icon={getIconBySight(item)()}
        title={item.title}>
        <SightPopup sight={item} />
        <Tooltip>#{item.sightId} &mdash; {item.title}</Tooltip>
    </Marker>
);

const cityZoom = [
    [15000, 11],
    [10000, 12],
    [5000, 13],
    [2000, 14],
    [1000, 15],
];
const getZoomCity = (city: ICityExtended): number => {
    for (const [radius, zoom] of cityZoom) {
        if (city.radius > radius) {
            return zoom;
        }
    }

    return 14;
};

export const CityMark: React.FC<{ item: ICityExtended }> = ({ item }: { item: ICityExtended }) => {
    const map = useMap();

    const events = React.useMemo(() => ({
        click: () => map.flyTo([item.latitude, item.longitude], getZoomCity(item)),
    }), [item.cityId]);

    const icon = React.useMemo(
        () => getIcon({ type: 'city', name: item.name, count: item.count }),
        [item.cityId],
    );

    return (
        <Marker
            position={[item.latitude, item.longitude]}
            icon={icon}
            title={item.name}
            eventHandlers={events}>
        </Marker>
    );
};
