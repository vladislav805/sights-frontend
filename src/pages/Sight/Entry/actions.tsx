import * as React from 'react';
import { useHistory } from 'react-router-dom';
import Button from '../../../components/Button';
import { ISight } from '../../../api/types/sight';
import API from '../../../api';
import SharePanel from '../../../components/SharePanel';
import AddToCollection from '../../../components/AddToCollection';
import useCurrentUser from '../../../hook/useCurrentUser';

type ISightEntryActionsProps = {
    sight: ISight;
};

const Actions: React.FC<ISightEntryActionsProps> = ({ sight }: ISightEntryActionsProps) => {
    const { sightId, canModify } = sight;

    const currentUser = useCurrentUser();
    const history = useHistory();
    const { onDeleteClick, onReportClick } = React.useMemo(() => ({
        onDeleteClick: () => {
            if (!confirm('Вы уверены, что хотите удалить эту достопримечательность?\nЕсли её уже не существует - вместо удаления лучше напишите об этом в комментарии - администраторы отметят достопримечательность архивной.')) {
                return;
            }
            void API.sights.remove({ sightId })
                .then(() => {
                    if (history.length) {
                        history.goBack();
                    } else {
                        history.replace('/');
                    }
                });
        },

        onReportClick: () => {
            if (!confirm('Вы уверены, что хотите отправить жалобу?')) {
                return;
            }
            void API.sights.report({ sightId })
                .then(() => {
                    alert('Спасибо! Жалоба отправлена.');
                });
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
                    key="edit"
                    link={`/sight/${sightId}/edit`}>
                    Редактировать
                </Button>
                <Button
                    key="remove"
                    label="Удалить"
                    onClick={onDeleteClick} />
            </>
        );
    } else {
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
    }
};

export default Actions;
