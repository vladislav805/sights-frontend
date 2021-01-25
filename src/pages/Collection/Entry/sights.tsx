import * as React from 'react';
import SightsGallery from '../../../components/SightsGallery/SightsGallery';
import { ISight } from '../../../api/types/sight';

type Props = {
    items: ISight[];
};

export const CollectionEntrySightsList: React.FC<Props> = (props: Props) => (
    <SightsGallery
        count={props.items.length}
        items={props.items} />
);
