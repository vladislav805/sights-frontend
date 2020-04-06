import * as React from 'react';
import { IProfile } from '.';
import { IUserAchievements } from '../../api';
import Icon from '@mdi/react';
import {
    mdiMapCheck as authorOfSights,
    mdiMapPlus as authorOfAllSights,
    mdiHail as visitedSights,
    mdiImagePlus as photosOfSights,
    mdiSelectMultipleMarker as authorOfCollections,
    mdiCommentMultiple as comments,
} from '@mdi/js';

type ForAchievements = Record<keyof IUserAchievements, string>;

const icons: ForAchievements = {
    authorOfAllSights,
    authorOfSights,
    visitedSights,
    photosOfSights,
    authorOfCollections,
    comments,
};

const descriptions: ForAchievements = {
    authorOfAllSights: 'Количество добавленных достопримечательностей',
    authorOfSights: 'Количество подтверждённых достопримечательностей',
    visitedSights: 'Количество посещённых достопримечательностей',
    photosOfSights: 'Количество добавленных фотографий',
    authorOfCollections: 'Количество созданных коллекций',
    comments: 'Количество написанных комментариев',
};

const renderAchievements = ({ user, achievements: a }: IProfile): React.ReactChild => {
    return (
        <div className="profile-achievements">
            {Object.keys(a).map((key: keyof IUserAchievements) => {
                const icon = icons[key];
                const label = descriptions[key];
                const value = a[key];
                return (
                    <div key={key} className="profile-achievements--item" title={label}>
                        <Icon
                            className="profile-achievements--icon"
                            path={icon} />
                        <div className="profile-achievements--value">{value}</div>
                    </div>
                );
            })}
        </div>
    );
};

export { renderAchievements };
