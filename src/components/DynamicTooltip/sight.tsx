import { ISight, VisitState } from '../../api/types/sight';
import { ITooltipContent } from './index';
import { templateWithPhoto } from './template-with-photo';

type SetSight = (sight: ISight) => void;

export const renderTooltipSight = (sight: ISight, _: SetSight): ITooltipContent => templateWithPhoto({
    title: sight.title,
    content: [
        sight.city && sight.city.name,
        'visitState' in sight && {
            [VisitState.NOT_VISITED]: 'не посещено',
            [VisitState.VISITED]: 'посещено',
            [VisitState.DESIRED]: 'желаемое',
        }[sight.visitState]
    ],
    photo: sight.photo,
    link: `/sight/${sight.sightId}`,
});
