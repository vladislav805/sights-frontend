import * as React from 'react';
import { IUserAchievements } from '../../api';
import Icon from '@mdi/react';
import {
    mdiMapCheck,
    mdiMapPlus,
    mdiHail,
    mdiImagePlus,
    mdiSelectMultipleMarker,
    mdiCommentMultiple,
} from '@mdi/js';

type AttachmentOf<T extends keyof IUserAchievements> = Record<keyof IUserAchievements[T], string>;
type ForAchievements = Record<keyof IUserAchievements, AttachmentOf<never>>;

const icons: ForAchievements = {
    sights: {
        created: mdiMapPlus,
        verified: mdiMapCheck,
        visited: mdiHail,
        desired: '',
    } as AttachmentOf<'sights'>,
    photos: {
        uploaded: mdiImagePlus,
    } as AttachmentOf<'photos'>,
    collections: {
        created: mdiSelectMultipleMarker,
    } as AttachmentOf<'collections'>,
    comments: {
        added: mdiCommentMultiple
    } as AttachmentOf<'comments'>,
};

const descriptions: ForAchievements = {
    sights: {
        created: 'Количество добавленных достопримечательностей',
        verified: 'Количество подтверждённых достопримечательностей',
        visited: 'Количество посещённых достопримечательностей',
        desired: 'Количество желаемых достопримечательностей',
    } as AttachmentOf<'sights'>,
    photos: {
        uploaded: 'Количество добавленных фотографий',
    } as AttachmentOf<'photos'>,
    collections: {
        created: 'Количество созданных коллекций',
    } as AttachmentOf<'collections'>,
    comments: {
        added: 'Количество написанных комментариев'
    } as AttachmentOf<'comments'>,
};

type IUserAchievementsProps = {
    achievements: IUserAchievements;
};

const UserAchievementBlock: React.FC<IUserAchievementsProps> = ({ achievements }: IUserAchievementsProps) => {
    type Item = {
        key: string;
        title: string;
        icon: string;
        value: number;
    };
    const items: Item[] = [];

    Object.keys(achievements).map((section: keyof IUserAchievements) =>
        Object.keys(achievements[section]).forEach((key: keyof AttachmentOf<keyof IUserAchievements>) => {
            const icon = icons[key];
            const title = descriptions[key];
            const value = achievements[section][key];
            items.push({ key: `${section}.${key as string}`, title, icon, value });
        })
    );
    return (
        <div className="profile-achievements">
            {items.map(({ key, title, icon, value }) => (
                <div
                    key={key}
                    className="profile-achievements--item"
                    title={title}>
                    <Icon
                        className='profile-achievements--icon'
                        path={icon} />
                    <div
                        className='profile-achievements--value'>
                        {value}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default UserAchievementBlock;
