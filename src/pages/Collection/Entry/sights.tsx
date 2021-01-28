import * as React from 'react';
import SightGallery from '../../../components/SightsGallery';
import { ISight } from '../../../api/types/sight';

type Props = {
    items: ISight[];
};

export const CollectionEntrySightsList: React.FC<Props> = (props: Props) => (
    <SightGallery
        count={props.items.length}
        items={props.items} />
);
