import * as React from 'react';
import './style.scss';
import MapX, { IMapItem } from '../Map';
import API, { ISight, IUsableSightWithDistance } from '../../api';
import { entriesToMap, humanizeDistance } from '../../utils';
import Nearby from './Nearby';

interface ISightMapLayoutProps {
    sight: ISight;
}

interface ISightMapLayoutState {
    near?: IUsableSightWithDistance[];
}

class SightMapLayout extends React.Component<ISightMapLayoutProps, ISightMapLayoutState> {
    state: ISightMapLayoutState = {

    };

    componentDidMount(): void {
        void this.tryFetchNearbySights();
    }

    private tryFetchNearbySights = async() => {
        const sight = this.props.sight;
        const { items, distances } = await API.sights.getNearby([sight.lat, sight.lng], 1500, 15);
        const dist = entriesToMap(distances, 'sightId');
        const near: IUsableSightWithDistance[] = items.map(sight => ({
            ...sight,
            distance: dist.get(sight.sightId)?.distance,
        }));

        this.setState({ near });
    };

    render(): JSX.Element {
        const { sight } = this.props;
        const { near } = this.state;

        const { lat, lng } = sight;

        const itemsOnMap: IMapItem[] = [
            {
                id: 0,
                title: 'Местоположение',
                position: [lat, lng],
                icon: {
                    type: 'sightRed',
                },
            }
        ];

        if (near) {
            const nearItems: IMapItem[] = near.map(({ sightId, lat, lng, title, distance }): IMapItem => ({
                id: sightId,
                position: [lat, lng],
                title,
                tooltip: `${title} (${humanizeDistance(distance)})`,
            }));
            itemsOnMap.splice(1, 0, ...nearItems);
        }

        return (
            <div className="sight-map-layout">
                <div className="sight-map-layout-map">
                    <MapX
                        items={itemsOnMap}
                        position={{ center: [lat, lng], zoom: 16 }}
                        saveLocation={false} />
                </div>
                {near && <Nearby items={near} />}
            </div>
        );
    }
}

export default SightMapLayout;
