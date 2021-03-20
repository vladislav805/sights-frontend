import { ISight } from '../../api/types/sight';

export type ISightGalleryItem = {
    sight: ISight;
};

export const enum SightGalleryView {
    GRID = 'grid',
    LIST = 'view',
}
