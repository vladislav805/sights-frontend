import { ICity } from './city';
import { IPhoto } from './photo';
import { IPlace } from './place';
import { ICategory } from './category';
import { ISightField } from './field';
import { IApiList } from './api';

export interface ISight extends IPlace {
    sightId: number;
    ownerId: number;
    tags: number[];
    dateCreated: number;
    dateUpdated: number;
    title: string;
    description: string;
    mask: number;
    categoryId: number;
    city?: ICity | null;
    rating?: ISightRating;
    photo?: IPhoto | null;
    category?: ICategory | null;

    visitState?: VisitState;
    canModify?: boolean;
    fields?: ISightField[];
}

export const enum SightMask {
    VERIFIED = 2,
    ARCHIVED = 4,
}

export interface IVisitStateStats {
    visited: number;
    desired: number;
}

export type ISightRating = {
    value: number;
    count: number;
    rated?: number;
};

export const enum VisitState {
    NOT_VISITED = 0,
    VISITED = 1,
    DESIRED = 2,
}

export type ISightDistance = {
    sightId: number;
    distance: number;
};

export type ListOfSightsWithDistances = IApiList<ISight> & { distances: ISightDistance[] };
