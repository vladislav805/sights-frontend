import * as React from 'react';
import { mdiAccountClockOutline, mdiBookAccountOutline, mdiCardAccountDetailsOutline } from '@mdi/js';
import { IUser } from '../../api/types/user';
import TextIconified from '../../components/TextIconified';
import { getLastSeen } from './lastSeen';
import { IPluralForms, pluralize } from '../../utils/pluralize';
import { IRank } from '../../api/types/rank';
import { ProfileRank } from './rank';

type IProfileContentProps = {
    user: IUser;
    rank: IRank;
};

const followers: IPluralForms = {
    one: 'подписчик',
    some: 'подписчика',
    many: 'подписчиков',
};

export const ProfileContent: React.FC<IProfileContentProps> = ({ user, rank }: IProfileContentProps) => (
    <div className="profile-content">
        <TextIconified
            icon={mdiBookAccountOutline}>
            {user.followers} {pluralize(user.followers, followers)}
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
            rank={rank} />
    </div>
);
