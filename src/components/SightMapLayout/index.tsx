import * as React from 'react';
import './style.scss';
import API, { ISight, IUsableSightWithDistance } from '../../api';
import { entriesToMap } from '../../utils';

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
        const { items, distances } = await API.sights.getNearby([sight.latitude, sight.longitude], 1500, 15);
        const dist = entriesToMap(distances, 'sightId');
        const near: IUsableSightWithDistance[] = items.map(sight => ({
            ...sight,
            distance: dist.get(sight.sightId)?.distance,
        }));

        this.setState({ near });
    };

    render(): JSX.Element {
        /*const { sight } = this.props;
        const { near } = this.state;

        const { latitude, longitude } = sight;

        const itemsOnMap: IMapItem[] = [
            {
                id: 0,
                title: 'Местоположение',
                position: [latitude, longitude],
                icon: {
                    type: 'sightRed',
                },
            }
        ];

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
                    { /*<MapX
                        items={itemsOnMap}
                        position={{ center: [latitude, longitude], zoom: 16 }}
                        saveLocation={false} /> */ }
                </div>
                { /*near && <Nearby items={near} /> */ }
            </div>
        );
    }
}

export default SightMapLayout;
