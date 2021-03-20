import * as React from 'react';
import { Marker, Tooltip } from 'react-leaflet';
import * as Leaflet from 'leaflet';
import { IPosition } from './common';
import { IPlace } from '../../../api/types/place';
import { sightIconBlue, sightIconRed } from '../../../utils/sight-icon';

type ISightMarkerProps = {
    position: IPosition;
    places: IPlace[];
    onPlaceSelected: (place: IPlace) => void;
    onPinPositionChanged: (latitude: number, longitude: number) => void;
};

export const SightMarker: React.FC<ISightMarkerProps> = (props: ISightMarkerProps) => {
    const { position, places } = props;

    const userMarkerRef = React.useRef<Leaflet.Marker>(null);

    const eventHandlers = React.useMemo<Leaflet.LeafletEventHandlerFnMap>(() => ({
        dragend() {
            const marker = userMarkerRef.current;
            if (marker) {
                const { lat, lng } = marker.getLatLng();
                props.onPinPositionChanged(lat, lng);
            }
        },
    }), []);

    let userMarker: React.ReactNode = null;

    switch (position?.type) {
        case 'pin': {
            userMarker = (
                <Marker
                    ref={userMarkerRef}
                    icon={sightIconRed}
                    position={[position.latitude, position.longitude]}
                    draggable
                    eventHandlers={eventHandlers}>
                    <Tooltip>Здесь</Tooltip>
                </Marker>
            );
            break;
        }

        case 'place': {
            userMarker = (
                <Marker
                    icon={sightIconRed}
                    position={[position.place.latitude, position.place.longitude]}>
                    <Tooltip>Здесь</Tooltip>
                </Marker>
            );
            break;
        }

        default:
    }

    return (
        <>
            {userMarker}
            {places && places.map(place => !(position && position.type === 'place' && position.place.placeId === place.placeId) && (
                <Marker
                    key={place.placeId}
                    icon={sightIconBlue}
                    position={[place.latitude, place.longitude]}
                    eventHandlers={{
                        click: () => props.onPlaceSelected(place),
                    }}>
                    <Tooltip>Место #{place.placeId}</Tooltip>
                </Marker>
            ))}
        </>
    );
};
