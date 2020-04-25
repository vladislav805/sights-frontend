import * as React from 'react';
import './style.scss';
import MapX, { IMapItem } from '../Map';
import VisitStateSelector from '../VisitStateSelector';
import API, { ISight, IUsableSightWithDistance, IVisitStateStats } from '../../api';
import { entriesToMap, humanizeDistance } from '../../utils';
import Nearby from './Nearby';

interface ISightMapLayoutProps {
    sight: ISight;
    visits: IVisitStateStats;
    isUser?: boolean;
}

interface ISightMapLayoutState {
    near?: IUsableSightWithDistance[];
}

class SightMapLayout extends React.Component<ISightMapLayoutProps, ISightMapLayoutState> {
    state: ISightMapLayoutState = {

    };

    componentDidMount() {
        this.tryFetchNearbySights();
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

    render() {
        const { sight, visits, isUser } = this.props;
        const { near } = this.state;

        const { sightId, lat, lng, visitState } = sight;

        const itemsOnMap: IMapItem[] = [
            {
                id: 0,
                title: 'Местопоожение',
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
                        position={{ center: [lat, lng], zoom: 14 }}
                        saveLocation={false} />
                </div>
                <div className="sight-map-layout-aside">
                    <VisitStateSelector
                        stats={visits}
                        selected={visitState}
                        canChange={isUser}
                        sightId={sightId} />
                    <div className="sight-map-layout-nearby">
                        {near && <Nearby items={near} />}
                    </div>
                </div>
            </div>
        );
    }
}

export default SightMapLayout;
