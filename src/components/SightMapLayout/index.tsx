import * as React from 'react';
import './style.scss';
import { MapContainer, Marker, Tooltip } from 'react-leaflet';
import { MapTileLayers } from '../../utils/map-utils';
import { IUsableSightWithDistance } from '../../api/local-types';
import { ISight } from '../../api/types/sight';
import { sightIconRed } from '../../utils/sight-icon';
import MapConfigurator from '../MapConfigurator';

interface ISightMapLayoutProps {
    sight: ISight;
    /* eslint-disable */
    nearSights: IUsableSightWithDistance[];
    /* eslint-enable */
}

const SightMapLayout: React.FC<ISightMapLayoutProps> = ({ sight }: ISightMapLayoutProps) => {
    const { latitude, longitude } = sight;

    /*
    if (near) {
        const nearItems: IMapItem[] = near.map(({ sightId, latitude, longitude, title, distance }): IMapItem => ({
            id: sightId,
            position: [latitude, longitude],
            title,
            tooltip: `${title} (${humanizeDistance(distance)})`,
        }));
        itemsOnMap.splice(1, 0, ...nearItems);
    }
    */

    return (
        <div className="sight-map-layout">
            <div className="sight-map-layout-map">
                <MapContainer
                    className="sight-map-layout-map"
                    center={[latitude, longitude]}
                    scrollWheelZoom={false}
                    zoom={16}>
                    <MapTileLayers />
                    <Marker
                        position={[sight.latitude, sight.longitude]}
                        icon={sightIconRed}
                        title={sight.title}>
                        <Tooltip>Эта достопримечательность</Tooltip>
                    </Marker>
                    <MapConfigurator
                        needInvalidateSize
                        saveLocation={false}
                        setLocationInAddress={false} />
                </MapContainer>
            </div>
            {/* near && <Nearby items={near} /> */}
        </div>
    );
};

export default SightMapLayout;
