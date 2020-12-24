import { IPlace } from '../../../api/types/place';

export type IPositionPin = {
    type: 'pin';
    latitude: number;
    longitude: number;
};

export type IPositionPlace = {
    type: 'place';
    place: IPlace;
};

export type IPosition = IPositionPin | IPositionPlace | undefined;
