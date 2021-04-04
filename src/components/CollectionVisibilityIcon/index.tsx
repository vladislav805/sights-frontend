import * as React from 'react';
import './style.scss';
import { mdiLightbulb, mdiLock, mdiPenLock } from '@mdi/js';
import Icon from '@mdi/react';
import { CollectionType, ICollection } from '../../api/types/collection';

type ICollectionVisibilityIconProps = {
    collection: ICollection;
};

const icons: Record<CollectionType, string> = {
    PUBLIC: null,
    PRIVATE: mdiLock,
    DRAFT: mdiPenLock,
    SYSTEM: mdiLightbulb,
};

const titles: Record<CollectionType, string> = {
    PUBLIC: 'Публичная коллекция - её видят все',
    PRIVATE: 'Приватная коллекция - её видят только те, у кого есть ссылка',
    DRAFT: 'Черновик - её видит только автор',
    SYSTEM: 'Системная коллекция',
};

const CollectionVisibilityIcon: React.FC<ICollectionVisibilityIconProps> = ({ collection }: ICollectionVisibilityIconProps) => {
    const { type } = collection;
    return icons[type] && (
        <Icon
            className="collection-visibility-icon"
            path={icons[type]}
            title={titles[type]}
            aria-label={titles[type]} />
    );
};

export default CollectionVisibilityIcon;
