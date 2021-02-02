import * as React from 'react';
import Button from '../Button';
import { mdiAccountMinus, mdiAccountPlus } from '@mdi/js';
import { IUser } from '../../api/types/user';
import useCurrentUser from '../../hook/useCurrentUser';
import API from '../../api';

type IFollowButtonProps = {
    user: IUser;
    onFollowStateChanged: (user: IUser) => void;
    mini?: boolean;
    className?: string;
};

const FollowButton: React.FC<IFollowButtonProps> = ({ user, onFollowStateChanged, mini, className }: IFollowButtonProps) => {
    const [followBusy, setFollowBusy] = React.useState<boolean>(false);

    const currentUser = useCurrentUser();
    const isCurrentUser = currentUser?.userId === user.userId;

    const toggleFollow = async() => {
        setFollowBusy(true);
        const { count } = await API.users.follow(user.userId, !user.isFollowed);
        setFollowBusy(false);
        onFollowStateChanged({
            ...user,
            isFollowed: !user.isFollowed,
            followers: count,
        });
    };

    return currentUser && !isCurrentUser ? (
        <Button
            className={className}
            color="transparent"
            icon={user.isFollowed ? mdiAccountMinus : mdiAccountPlus}
            label={user.isFollowed ? 'Отписаться' : 'Подписаться'}
            loading={followBusy}
            size={mini ? 's' : 'm'}
            onClick={toggleFollow} />
    ) : null;
};

export default FollowButton;
