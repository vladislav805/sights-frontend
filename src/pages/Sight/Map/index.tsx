import * as React from 'react';
import './style.scss';
import { CLASS_COMPACT, CLASS_WIDE, withClassBody } from '../../../hoc';
import Map, { IMapItem } from '../../../components/Map';
import API, { ICity, ISight } from '../../../api';
import * as Leaflet from 'leaflet';
import { LatLngTuple } from 'leaflet';
import { Popup } from 'react-leaflet';
import { getCoordinatesFromMap } from '../../../components/Map/utils';
import { Link } from 'react-router-dom';
import classNames from 'classnames';

interface IMapPageProps {

}

interface IMapPageState {
    type?: 'sights' | 'cities';
    items: ISight[] | ICity[];
}

type Bounds = { ne: LatLngTuple; sw: LatLngTuple };
class MapPage extends React.Component<IMapPageProps, IMapPageState> {
    state: IMapPageState = {
        items: [],
    };

    private onReady = (map: Leaflet.Map) => {
        const { ne, sw } = getCoordinatesFromMap(map);
        this.load(ne, sw);
    };

    private load = async(oNE: LatLngTuple, oSW: LatLngTuple) => {
        const { ne, sw } = this.addOverflowToCoordinates({ ne: oNE, sw: oSW })
        const { type, items } = await API.sights.get(ne, sw);
        this.setState({ type, items });
    };

    private addOverflowToCoordinates = ({ ne: [neLat, neLng], sw: [swLat, swLng] }: Bounds): Bounds => {
        const scaleX = Math.abs(neLat - swLat) * .1;
        const scaleY = Math.abs(neLng - swLng) * .1;

        return {
            ne: [
                neLat + scaleX,
                neLng + scaleY,
            ] as LatLngTuple,
            sw: [
                swLat - scaleX,
                swLng - scaleY,
            ] as LatLngTuple,
        };
    };

    private drawPlacemark = ({ data }: IMapItem) => {
        switch (this.state.type) {
            case 'sights': {
                const { sightId, title, description, photo } = data as ISight;
                return (
                    <Popup
                        minWidth={280}
                        autoPan={false}
                        closeOnEscapeKey
                        closeButton>
                        <div
                            className={classNames('map-sight-popup', {
                                'map-sight-popup__withPhoto': !!photo,
                            })}>
                            {photo && (
                                <Link
                                    className="map-sight-popup--photo"
                                    to={`/sight/${sightId}`}
                                    target="_blank"
                                    rel="noopener noreferrer">
                                    <img
                                        src={photo.photo200}
                                        alt="Photo" />
                                </Link>
                            )}
                            <div className="map-sight-popup--content">
                                <h4 className="map-sight-popup--title">
                                    <Link
                                        to={`/sight/${sightId}`}
                                        target="_blank"
                                        rel="noopener noreferrer">
                                        {title}
                                    </Link>
                                </h4>
                                <p className="map-sight-popup--description">{description}</p>
                            </div>
                        </div>
                    </Popup>
                );
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
                        icon: {
                            type: 'sightDefault',
                        },
                    };
                }

                case 'cities': {
                    const { cityId, lat, lng, name, count } = item as ICity;
                    return {
                        id: -cityId,
                        position: [lat, lng],
                        title: name,
                        data: item,
                        icon: {
                            type: 'city',
                            count,
                            name,
                        },
                    }
                }

                default: {
                    return null;
                }
            }
        });
    };

    private onCityClicked = (item: IMapItem, map: Leaflet.Map) => {
        map.setView(item.position, 14);
    };

    render() {
        return (
            <Map
                saveLocation={true}
                saveLocationInUrl={true}
                onMapReady={this.onReady}
                onLocationChanged={this.load}
                clusterize={this.state.type === 'sights'}
                items={this.prepareItems(this.state.items)}
                drawItem={this.drawPlacemark}
                onItemClicked={this.state.type === 'cities' ? this.onCityClicked : undefined} />
        )
    }
}

export default withClassBody([CLASS_COMPACT, CLASS_WIDE])(MapPage);
