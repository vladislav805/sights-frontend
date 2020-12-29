import * as React from 'react';
import { ISight, SightMask } from '../../api/types/sight';
import Button from '../Button';
import { isBit } from '../../utils/is-bit';
import API from '../../api';

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

    return (
        <>
            <Button
                label={`Подтверждение: ${isBit(sight.mask, SightMask.VERIFIED) ? 'да' : 'нет'}`}
                onClick={onVerifyClick}
                loading={busy}
                disabled={busy} />
            <Button
                label={`Существует: ${!isBit(sight.mask, SightMask.ARCHIVED) ? 'да' : 'нет'}`}
                onClick={onArchiveClick}
                loading={busy}
                disabled={busy} />
        </>
    );
};

export default StateActions;
