import * as React from 'react';
import './sight-mask.scss';
import { mdiHelpRhombus } from '@mdi/js';
import { ArchivedIcon, VerifiedIcon } from './icons';
import { isBit } from '../utils/is-bit';
import { SightMask } from '../api/types/sight';
import TextIconified from '../components/TextIconified';
import { ArchivedLabel, VerifiedLabel } from './labels';

const humanizedState = [
    { icon: mdiHelpRhombus, label: 'Нет информации по подтверждению', className: 'unknown' },
    { icon: VerifiedIcon, label: VerifiedLabel, className: 'verified' },
    { icon: ArchivedIcon, label: ArchivedLabel, className: 'archived' },
];

export const renderSightMaskExplanation = (mask: number): React.ReactNode => {
    // 0 - unknown, 1 - verified, 2 - archived
    const state = isBit(mask, SightMask.ARCHIVED) ? 2 : (isBit(mask, SightMask.VERIFIED) ? 1 : 0);
    const { icon, label, className } = humanizedState[state];

    return (
        <TextIconified className={`visitState__${className}`} icon={icon}>{label}</TextIconified>
    );
};
