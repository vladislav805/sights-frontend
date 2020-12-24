import * as React from 'react';
import './style.scss';
import { MapContainer, Marker, Tooltip } from 'react-leaflet';
import { MapController, MapTileLayers } from '../../utils/map-utils';
import iconCreator from '../Map/Icon';
import { IUsableSightWithDistance } from '../../api/local-types';
import { ISight } from '../../api/types/sight';

interface ISightMapLayoutProps {
    sight: ISight;
    nearSights: IUsableSightWithDistance[];
}

const SightMapLayout: React.FC<ISightMapLayoutProps> = ({ sight }: ISightMapLayoutProps) => {

   /* private tryFetchNearbySights = async() => {
        const sight = this.props.sight;
        const { items, distances } = await API.sights.getNearby([sight.latitude, sight.longitude], 1500, 15);
        const dist = entriesToMap(distances, 'sightId');
        const near: IUsableSightWithDistance[] = items.map(sight => ({
            ...sight,
            distance: dist.get(sight.sightId)?.distance,
        }));

        this.setState({ near });
    };*/

    const { latitude, longitude } = sight;

    /*if (near) {
        const nearItems: IMapItem[] = near.map(({ sightId, latitude, longitude, title, distance }): IMapItem => ({
            id: sightId,
            position: [latitude, longitude],
            title,
            tooltip: `${title} (${humanizeDistance(distance)})`,
        }));
        itemsOnMap.splice(1, 0, ...nearItems);
    }*/

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
                        icon={iconCreator({type: 'sightRed'})}
                        title={sight.title}>
                        <Tooltip>Эта достопримечательность</Tooltip>
                    </Marker>
                    <MapController
                        saveLocation={false}
                        setLocationInAddress={false} />
                </MapContainer>
            </div>
            { /*near && <Nearby items={near} /> */ }
        </div>
    );
}

export default SightMapLayout;
