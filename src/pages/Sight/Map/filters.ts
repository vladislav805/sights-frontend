import { ISight } from '../../../api';

type SightListFilterFactory<T> = (value: T) => SightListFilter;

export type SightListFilterRemote = { type: 'remote', value: string };
export type SightListFilterClient = { type: 'client', filter: SightListFilterFunction };
export type SightListFilter = SightListFilterRemote | SightListFilterClient;

export type SightListFilterFunction = (sight: ISight) => boolean;

export type TVerified = 'UNSET' | 'VERIFIED' | 'NOT_VERIFIED';
export type VVerified = '' | 'verified' | '!verified';

export type TVisited = 'UNSET' | 'VISITED' | 'NOT_VISITED' | 'DESIRED';
export type VVisited = '' | 'visited' | '!visited' | 'desired';

export type TPhoto = 'UNSET' | 'EXISTS' | 'NOT_EXISTS';
export type VPhoto = '' | 'photo' | '!photo';

export type TArchived = 'UNSET' | 'ARCHIVED' | 'NOT_ARCHIVED';
export type VArchived = '' | 'archived' | '!archived';

export const UNSET = '';

export const Verified: Record<TVerified, VVerified> = {
    UNSET,
    VERIFIED: 'verified',
    NOT_VERIFIED: '!verified',
};

export const Visited: Record<TVisited, VVisited> = {
    UNSET,
    VISITED: 'visited',
    NOT_VISITED: '!visited',
    DESIRED: 'desired',
};

export const Photo: Record<TPhoto, VPhoto> = {
    UNSET,
    EXISTS: 'photo',
    NOT_EXISTS: '!photo',
};

export const Archived: Record<TArchived, VArchived> = {
    UNSET,
    ARCHIVED: 'archived',
    NOT_ARCHIVED: '!archived',
};

export const createVerifiedFilter: SightListFilterFactory<VVerified> = value => ({ type: 'remote', value });
export const createVisitedFilter: SightListFilterFactory<VVisited> = value => ({ type: 'remote', value });
export const createPhotoFilter: SightListFilterFactory<VPhoto> = value => ({ type: 'remote', value });
export const createArchivedFilter: SightListFilterFactory<VArchived> = value => ({ type: 'remote', value });
/*
sight => {
        return value === Verified.UNSET ||
            value === Verified.VERIFIED && isBit(sight.mask, SightMask.VERIFIED) ||
            value === Verified.NOT_VERIFIED && !isBit(sight.mask, SightMask.VERIFIED);
    }
 */
