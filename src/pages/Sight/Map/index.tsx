import * as React from 'react';
import { CLASS_COMPACT, withClassBody } from '../../../hoc';
import Map, { IMapItem } from '../../../components/Map';
import API, { ICity, ISight } from '../../../api';
import { LatLngTuple } from 'leaflet';
import { Popup } from 'react-leaflet';
import * as Leaflet from 'leaflet';
import { getCoordinatesFromMap } from '../../../components/Map/utils';
import { Link } from 'react-router-dom';

interface IMapPageProps {

}

interface IMapPageState {
    type?: 'sights' | 'cities';
    items: ISight[] | ICity[];
}

class MapPage extends React.Component<IMapPageProps, IMapPageState> {
    state: IMapPageState = {
        items: [],
    };

    private onReady = (map: Leaflet.Map) => {
        const { ne, sw } = getCoordinatesFromMap(map);
        this.load(ne, sw);
    };

    private load = async(ne: LatLngTuple, sw: LatLngTuple) => {
        const { type, items } = await API.sights.get(ne, sw);

        this.setState({ type, items });
    };

    private drawPlacemark = ({ data }: IMapItem) => {
        switch (this.state.type) {
            case 'sights': {
                const { sightId, title, description } = data as ISight;
                return (
                    <>
                        <Popup
                            className="map-sight-popup"
                            autoPan={false}
                            closeOnEscapeKey
                            closeButton>
                            <h4 className="map-sight-popup--title">
                                <Link
                                    to={`/sight/${sightId}`}
                                    target="_blank"
                                    rel="noopener noreferrer">
                                    {title}
                                </Link>
                            </h4>
                            <p className="map-sight-popup--description">{description}</p>
                        </Popup>
                    </>
                );
            }

            case 'cities': {
                return null;
            }

            default: {
                return null;
            }
        }
    };

    private prepareItems = (items: (ISight | ICity)[]): IMapItem[] => {
        return items.map((item: ISight | ICity) => {
            switch (this.state.type) {
                case 'sights': {
                    const { sightId, lat, lng, title, } = item as ISight;
                    return {
                        id: sightId,
                        position: [lat, lng],
                        title,
                        tooltip: title,
                        data: item,
                    };
                }

                case 'cities': {
                    const { cityId, lat, lng, name, count } = item as ICity;
                    return {
                        id: -cityId,
                        position: [lat, lng],
                        title: name,
                        tooltip: `${name} (${count})`,
                        data: item,
                    }
                }

                default: return null;
            }
        });
    };

    private onCityClicked = (item: IMapItem, map: Leaflet.Map) => {
        map.setView(item.position, 14);
    };

    render() {
        return (
            <Map
                onMapReady={this.onReady}
                onLocationChanged={this.load}
                items={this.prepareItems(this.state.items)}
                drawItem={this.drawPlacemark}
                onItemClicked={this.state.type === 'cities' ? this.onCityClicked : undefined} />
        )
    }
}

export default withClassBody([CLASS_COMPACT])(MapPage);

