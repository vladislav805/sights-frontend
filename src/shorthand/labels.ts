import { VisitState } from '../api/types/sight';

export const VisitStateLabel: Record<VisitState, string> = {
    [VisitState.NOT_VISITED]: 'Не посещено',
    [VisitState.VISITED]: 'Посещено',
    [VisitState.DESIRED]: 'Желаемое',
};

export const VerifiedLabel = 'Подтверждено';

export const ArchivedLabel = 'Более не существует';
