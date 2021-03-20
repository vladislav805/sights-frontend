import * as React from 'react';
import { ISight, IVisitStateStats } from '../../api/types/sight';
import { ITooltipContent } from './common';
import { templateWithPhoto } from './template-with-photo';
import VisitStateSelector from '../VisitStateSelector';
import StarRating from '../StarRating';

type SetSight = (sight: ISight) => void;
export type ISightWVS = ISight & {
    vs: IVisitStateStats;
};

export const renderTooltipSight = (sight: ISightWVS, setSight: SetSight): ITooltipContent => templateWithPhoto({
    title: sight.title,
    content: [
        sight.city && sight.city.name,
        <StarRating
            key="rating"
            value={sight.rating.value}
            count={sight.rating.count}
            rated={sight.rating.rated}
            enabled={false} />,
        <VisitStateSelector
            key="visit"
            mini
            sightId={sight.sightId}
            stats={sight.vs}
            canChange={'visitState' in sight}
            selected={sight.visitState}
            onChange={visitState => setSight({ ...sight, visitState })} />,
    ],
    photo: sight.photo,
    link: `/sight/${sight.sightId}`,
});
