import * as React from 'react';
import { IUser } from '../../api/types/user';
import Button from '../../components/Button';
import { mdiAccountEdit } from '@mdi/js';
import useCurrentUser from '../../hook/useCurrentUser';

type IProfileActionsProps = {
    user: IUser;
    setUser: (user: IUser) => void;
};

export const ProfileActions: React.FC<IProfileActionsProps> = (props: IProfileActionsProps) => {
    const user = props.user;
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
