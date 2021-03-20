import * as React from 'react';
import { mdiAccountEdit } from '@mdi/js';
import { IUser } from '../../api/types/user';
import Button from '../../components/Button';
import useCurrentUser from '../../hook/useCurrentUser';

type IProfileActionsProps = {
    user: IUser;
};

export const ProfileActions: React.FC<IProfileActionsProps> = ({ user }: IProfileActionsProps) => {
    const currentUser = useCurrentUser();
    const isCurrentUser = currentUser.userId === user.userId;
    return (
        <div className="profile-actions">
            {isCurrentUser && (
                <Button
                    icon={mdiAccountEdit}
                    label="Редактировать"
                    link="/island/settings?tab=profile" />
            )}
        </div>
    );
};
