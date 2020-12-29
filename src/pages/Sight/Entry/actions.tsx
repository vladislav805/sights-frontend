import * as React from 'react';
import { Link, useHistory } from 'react-router-dom';
import Button from '../../../components/Button';
import { ISight } from '../../../api/types/sight';
import API from '../../../api';
import SharePanel from '../../../components/SharePanel';

type ISightEntryActionsProps = {
    sight: ISight;
};

const Actions: React.FC<ISightEntryActionsProps> = ({ sight }: ISightEntryActionsProps) => {
    const { sightId, canModify } = sight;

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

    if (canModify) {
        return (
            <>
                {share}
                <Link
                    className="xButton xButton__primary xButton__size-m"
                    key="edit"
                    to={`/sight/${sightId}/edit`}>
                    Редактировать
                </Link>
                <Button
                    key="remove"
                    label="Удалить"
                    onClick={onDeleteClick} />
            </>
        );
    } else {
        return (
            <>
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
