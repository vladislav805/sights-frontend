import * as React from 'react';
import { IUser } from '../../api/types/user';
import { pluralize } from '../../utils/pluralize';
import { templateWithPhoto } from './template-with-photo';
import FollowButton from '../FollowButton';
import { ITooltipContent } from './common';

type SetUser = (user: IUser) => void;

export const renderTooltipUser = (user: IUser, setUser: SetUser): ITooltipContent => templateWithPhoto({
    title: `${user.firstName} ${user.lastName}`,
    content: [
        user.city && user.city.name,
        user.followers > 0 && `${user.followers} ${pluralize(user.followers, {
            one: 'подписчик',
            some: 'подписчика',
            many: 'подписчиков',
        })}`,
        'isFollowed' in user && (
            <FollowButton user={user} onFollowStateChanged={setUser} mini />
        ),
    ],
    photo: user.photo,
    link: `/user/${user.login}`,
});
