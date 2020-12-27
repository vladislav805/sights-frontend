import * as React from 'react';
import {
    mdiCommentMultiple,
    mdiHail,
    mdiImagePlus,
    mdiMapCheck,
    mdiMapPlus,
    mdiSelectMultipleMarker,
    mdiWalk,
} from '@mdi/js';
import { IUserAchievements, Sex } from '../../api/types/user';
import TextIconified from '../../components/TextIconified';

type AttachmentOf<T extends keyof IUserAchievements, V = string> = Record<keyof IUserAchievements[T], V>;
type ForAchievements = Record<keyof IUserAchievements, AttachmentOf<never>>;

const icons: ForAchievements = {
    sights: {
        created: mdiMapPlus,
        verified: mdiMapCheck,
        visited: mdiHail,
        desired: mdiWalk,
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
        created: 'Добавил%f',
        verified: 'Из них подтверждено',
        visited: 'Посетил%f',
        desired: 'Хочет посетить',
    } as AttachmentOf<'sights'>,
    photos: {
        uploaded: 'Загрузил%f фотографий',
    } as AttachmentOf<'photos'>,
    collections: {
        created: 'Создал%f коллекций',
    } as AttachmentOf<'collections'>,
    comments: {
        added: 'Написал%f комментариев'
    } as AttachmentOf<'comments'>,
};

type IUserAchievementsProps = {
    sex: Sex;
    achievements: IUserAchievements;
};

const UserAchievementBlock: React.FC<IUserAchievementsProps> = ({ achievements, sex }: IUserAchievementsProps) => {
    type Item = {
        key: string;
        title: string;
        icon: string;
        value: number;
    };
    const items: Item[] = [];

    Object.keys(achievements).map((section: keyof IUserAchievements) =>
        Object.keys(achievements[section]).forEach((key: keyof AttachmentOf<keyof IUserAchievements>) => {
            const icon = icons[section][key];
            const value = achievements[section][key];
            const title = descriptions[section][key]
                .replace(/%f/ig, sex === Sex.FEMALE ? 'а' : '');

            items.push({ key: `${section}.${key as string}`, title, icon, value });
        })
    );
    return (
        <div className="profile-achievements">
            {items.map(({ key, title, icon, value }) => (
                <TextIconified key={key} icon={icon}>
                    {title}: {value}
                </TextIconified>
            ))}
        </div>
    );
};
/*
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
 */

export default UserAchievementBlock;
