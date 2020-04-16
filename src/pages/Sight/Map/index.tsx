import * as React from 'react';
import { CLASS_COMPACT, withClassBody } from '../../../hoc';
import Map from '../../../components/Map';
import API, { ICity, ISight } from '../../../api';
import { LatLngTuple } from 'leaflet';
import { Marker, Popup, Tooltip } from 'react-leaflet';
import * as Leaflet from 'leaflet';
import { getCoordinatesFromMap } from '../../../components/Map/utils';
import SightLayout from '../../../components/Map/SightLayout';

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

    private drawPlacemark = (item: ISight | ICity) => {
        switch (this.state.type) {
            case 'sights': {
                const { sightId, lat, lng, title, } = item as ISight;
                return (
                    <Marker
                        key={sightId}
                        position={[lat, lng]}
                        title={title}>
                        <Tooltip>{title}</Tooltip>
                        <Popup
                            className="map-sight-popup"
                            autoPan={false}
                            closeOnEscapeKey
                            closeButton>
                            <SightLayout sight={item as ISight} />
                        </Popup>
                    </Marker>
                );
            }

            case 'cities': {
                const { cityId, lat, lng, name, count } = item as ICity;
                return (
                    <Marker
                        key={-cityId}
                        position={[lat, lng]}
                        title={name}>
                        <Tooltip>{name} ({count})</Tooltip>
                    </Marker>
                );
            }

            default: return null;
        }
    };

    render() {
        return (
            <Map
                onMapReady={this.onReady}
                onLocationChanged={this.load}
                items={this.state.items}
                drawItem={this.drawPlacemark} />
        )
    }
}

export default withClassBody([CLASS_COMPACT])(MapPage);

