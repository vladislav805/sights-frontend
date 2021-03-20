import * as React from 'react';
import { Marker, Tooltip, useMap } from 'react-leaflet';
import { ISight } from '../../../api/types/sight';
import { ICityExtended } from '../../../api/types/city';
import { cityFactoryIcon, getIconBySight } from '../../../utils/sight-icon';
import SightPopup from '../../../components/SightPopup';
import { useCurrentWidth } from '../../../utils/width';

export const SightMark: React.FC<{ item: ISight }> = ({ item }: { item: ISight }) => (
    <Marker
        position={[item.latitude, item.longitude]}
        icon={getIconBySight(item)}
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

    const width = useCurrentWidth();

    // eslint-disable-next-line no-nested-ternary
    const threshold = width < 1400 ? (width < 800 ? -2 : -1) : 0;

    const events = React.useMemo(() => ({
        click: () => map.flyTo([item.latitude, item.longitude], getZoomCity(item) - threshold, {
            duration: 1,
        }),
    }), [item.cityId]);

    const icon = React.useMemo(
        () => cityFactoryIcon(item),
        [item.cityId],
    );

    return (
        <Marker
            position={[item.latitude, item.longitude]}
            icon={icon}
            title={item.name}
            eventHandlers={events} />
    );
};
