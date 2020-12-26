export type ICity = {
    cityId: number;
    name: string;
    parent?: ICity;
};

export type ICityExtended = ICity & {
    description: string;
    radius: number;
    latitude: number;
    longitude: number;
    count?: number;
};
