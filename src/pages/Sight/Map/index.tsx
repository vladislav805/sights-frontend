import * as React from 'react';
import { CLASS_COMPACT, withClassBody } from '../../../hoc';
import Map, { IMapItem } from '../../../components/Map';
import API, { ICity, ISight } from '../../../api';
import { LatLngTuple } from 'leaflet';
import { Marker, Popup, Tooltip } from 'react-leaflet';
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

    private drawPlacemark = ({ id, title, description }: IMapItem) => {
        switch (this.state.type) {
            case 'sights': {
                return (
                    <>
                        <Popup
                            className="map-sight-popup"
                            autoPan={false}
                            closeOnEscapeKey
                            closeButton>
                            <h4 className="map-sight-popup--title">
                                <Link
                                    to={`/sight/${id}`}
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

            default: return null;
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
                    };
                }

                case 'cities': {
                    const { cityId, lat, lng, name, count } = item as ICity;
                    return {
                        id: -cityId,
                        position: [lat, lng],
                        title: name,
                        tooltip: `${name} (${count})`,
                    }
                }

                default: return null;
            }
        });
    };

    private onCityClicked = (map: Leaflet.Map, item: IMapItem) => {
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

