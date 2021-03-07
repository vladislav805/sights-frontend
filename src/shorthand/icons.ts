import { mdiCheckDecagram, mdiClose, mdiEmoticonSadOutline, mdiRun, mdiTooltipCheck, mdiMapMarker } from '@mdi/js';
import { VisitState } from '../api/types/sight';

export const VisitStateIcon: Record<VisitState, string> = {
    [VisitState.NOT_VISITED]: mdiClose,
    [VisitState.VISITED]: mdiTooltipCheck,
    [VisitState.DESIRED]: mdiRun,
};

export const VerifiedIcon = mdiCheckDecagram;

export const ArchivedIcon = mdiEmoticonSadOutline;

export const AddressIcon = mdiMapMarker;
