import * as React from 'react';
import { useHistory } from 'react-router-dom';
import Button from '../../../components/Button';
import { ISight } from '../../../api/types/sight';
import API from '../../../api';
import SharePanel from '../../../components/SharePanel';
import AddToCollection from '../../../components/AddToCollection';
import useCurrentUser from '../../../hook/useCurrentUser';
import { showToast } from '../../../ui-non-react/toast';

type ISightEntryActionsProps = {
    sight: ISight;
};

const Actions: React.FC<ISightEntryActionsProps> = ({ sight }: ISightEntryActionsProps) => {
    const { sightId, canModify } = sight;

    const currentUser = useCurrentUser();
    const history = useHistory();
    const { onDeleteClick, onReportClick } = React.useMemo(() => ({
        onDeleteClick: () => {
            if (!window.confirm('Вы уверены, что хотите удалить эту достопримечательность?\nЕсли её уже не существует'
                + ' - вместо удаления лучше напишите об этом в комментарии - администраторы отметят'
                + ' достопримечательность архивной.')) {
                return;
            }

            API.sights.remove({ sightId })
                .then(() => {
                    if (history.length) {
                        history.goBack();
                    } else {
                        history.replace('/');
                    }
                });
        },

        onReportClick: () => {
            if (!window.confirm('Вы уверены, что хотите отправить жалобу?')) {
                return;
            }

            API.sights.report({ sightId }).then(() => showToast('Спасибо! Жалоба отправлена.'));
        },
    }), [sight]);

    const share = (
        <SharePanel
            link={`/sight/${sightId}`}
            text={`Достопримечательность «${sight.title}»`} />
    );

    const collect = currentUser && (
        <AddToCollection
            sightId={sight.sightId} />
    );

    if (canModify) {
        return (
            <>
                {collect}
                {share}
                <Button
                    label="Редактировать"
                    link={`/sight/${sightId}/edit`} />
                <Button
                    label="Удалить"
                    onClick={onDeleteClick} />
            </>
        );
    }

    return (
        <>
            {collect}
            {share}
            <Button
                key="report"
                label="Пожаловаться"
                onClick={onReportClick} />
        </>
    );
};

export default Actions;
