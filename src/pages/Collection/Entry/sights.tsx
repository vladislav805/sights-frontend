import * as React from 'react';
import SightGallery from '../../../components/SightsGallery';
import { ISight } from '../../../api/types/sight';

type Props = {
    items: ISight[];
};

export const CollectionEntrySightsList: React.FC<Props> = ({ items }: Props) => (
    <SightGallery
        count={items.length}
        items={items} />
);
