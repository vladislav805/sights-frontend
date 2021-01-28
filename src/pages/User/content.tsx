import * as React from 'react';
import { IUser } from '../../api/types/user';
import TextIconified from '../../components/TextIconified';
import { mdiAccountClockOutline, mdiBookAccountOutline, mdiCardAccountDetailsOutline } from '@mdi/js';
import { getLastSeen } from './lastSeen';
import { pluralize } from '../../utils';
import { IRank } from '../../api/types/rank';
import { ProfileRank } from './rank';

type IProfileContentProps = {
    user: IUser;
    rank: IRank;
};

export const ProfileContent: React.FC<IProfileContentProps> = (props: IProfileContentProps) => {
    const user = props.user;
    return (
        <div className="profile-content">
            <TextIconified
                icon={mdiBookAccountOutline}>
                {user.followers} {pluralize(user.followers, {
                one: 'подписчик',
                some: 'подписчика',
                many: 'подписчиков',
            })}
            </TextIconified>
            {user.bio && (
                <TextIconified
                    icon={mdiCardAccountDetailsOutline}>
                    {user.bio}
                </TextIconified>
            )}
            <TextIconified
                icon={mdiAccountClockOutline}>
                {getLastSeen(user)}
            </TextIconified>
            <ProfileRank
                user={user}
                rank={props.rank} />
        </div>
    );
};
