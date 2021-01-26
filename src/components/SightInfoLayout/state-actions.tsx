import * as React from 'react';
import { ISight, SightMask } from '../../api/types/sight';
import Button from '../Button';
import { isBit } from '../../utils/is-bit';
import API from '../../api';
import { mdiCheckCircleOutline, mdiCloseBox, mdiCloseCircleOutline, mdiMarkerCheck } from '@mdi/js';
import AddToCollection from '../AddToCollection';

type IStateActionsProps = {
    sight: ISight;
    onChangeSight: (sight: ISight) => void;
};

const StateActions: React.FC<IStateActionsProps> = ({ onChangeSight, sight }: IStateActionsProps) => {
    const [busy, setBusy] = React.useState<boolean>(false);

    const { onVerifyClick, onArchiveClick } = React.useMemo(() => ({
        onVerifyClick: () => {
            setBusy(true);
            const has = isBit(sight.mask, SightMask.VERIFIED);

            const mask = has
                ? sight.mask & ~SightMask.VERIFIED
                : sight.mask | SightMask.VERIFIED;

            void API.sights.setMask({ sightId: sight.sightId, mask })
                .then(() => {
                    setBusy(false);
                    onChangeSight({
                        ...sight,
                        mask,
                    });
                });
        },
        onArchiveClick: () => {
            setBusy(true);
            const has = isBit(sight.mask, SightMask.ARCHIVED);

            const mask = has
                ? sight.mask & ~SightMask.ARCHIVED
                : sight.mask | SightMask.ARCHIVED;

            void API.sights.setMask({ sightId: sight.sightId, mask })
                .then(() => {
                    setBusy(false);
                    onChangeSight({
                        ...sight,
                        mask,
                    });
                });
        },
    }), [sight]);

    const isVerified = isBit(sight.mask, SightMask.VERIFIED);
    const isExists = !isBit(sight.mask, SightMask.ARCHIVED);

    return (
        <>
            <Button
                icon={isVerified ? mdiMarkerCheck : mdiCloseBox}
                label={`Подтверждение: ${isVerified ? 'да' : 'нет'}`}
                onClick={onVerifyClick}
                loading={busy} />
            <Button
                icon={isExists ? mdiCheckCircleOutline : mdiCloseCircleOutline}
                label={`Существует: ${isExists ? 'да' : 'нет'}`}
                onClick={onArchiveClick}
                loading={busy} />
            <AddToCollection sightId={sight.sightId} />
        </>
    );
};

export default StateActions;
