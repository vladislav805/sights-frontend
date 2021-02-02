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
import { IUser, IUserAchievements } from '../../api/types/user';
import { objectKeys } from '../../utils/object-utils';
import Icon from '@mdi/react';

type IProfileAchievementsProps = {
    user: IUser;
    achievements: IUserAchievements;
};

type AchievementsFlatName =
    | 'sight_created'
    | 'sight_verified'
    | 'sight_visited'
    | 'sight_desired'
    | 'photo_uploaded'
    | 'collection_created'
    | 'comment_added';

type IAchievementsFlat = Record<AchievementsFlatName, number>;

const icons: Record<AchievementsFlatName, string> = {
    sight_created: mdiMapPlus,
    sight_verified: mdiMapCheck,
    sight_visited: mdiHail,
    sight_desired: mdiWalk,
    photo_uploaded: mdiImagePlus,
    collection_created: mdiSelectMultipleMarker,
    comment_added: mdiCommentMultiple,
};

const descriptions: Record<AchievementsFlatName, string> = {
    sight_created: 'Добавлено достопримечательностей',
    sight_verified: 'Добавлено подтвержденных достопримечательностей',
    sight_visited: 'Посещено',
    sight_desired: 'Желает посетить',
    photo_uploaded: 'Загружено фотографий',
    collection_created: 'Создано коллекций',
    comment_added: 'Написано комментариев',
};

const convert2array = (a: IUserAchievements): IAchievementsFlat => ({
    sight_created: a.sights.created,
    sight_verified: a.sights.verified,
    sight_visited: a.sights.visited,
    sight_desired: a.sights.desired,
    photo_uploaded: a.photos.uploaded,
    collection_created: a.collections.created,
    comment_added: a.comments.added,
});

type IAchievementItem = {
    key: AchievementsFlatName;
    title: string;
    icon: string;
    value: number;
};

const ProfileAchievementBlock: React.FC<IProfileAchievementsProps> = (props: IProfileAchievementsProps) => {
    const { achievements } = props;

    const items = React.useMemo(() => {
        const a = convert2array(achievements);
        return objectKeys(a).map(key => ({
            key,
            title: descriptions[key],
            icon: icons[key],
            value: a[key],
        }) as IAchievementItem);
    }, [achievements]);

    return (
        <div className="profile-achievements">
            {items.map(({ key, icon, title, value }) => (
                <div
                    key={key}
                    className="profile-achievements--item"
                    title={title}>
                    <Icon
                        className="profile-achievements--icon"
                        path={icon}
                        size={1.5} />
                    <div className="profile-achievements--value">{value}</div>
                </div>
            ))}
        </div>
    );
};

export default ProfileAchievementBlock;
