import * as React from 'react';
import './style.scss';
import { CollectionType, ICollection } from '../../api/types/collection';
import { mdiLock, mdiPenLock } from '@mdi/js';
import Icon from '@mdi/react';

type ICollectionVisibilityIconProps = {
    collection: ICollection;
};

const icons: Record<CollectionType, string> = {
    PUBLIC: null,
    PRIVATE: mdiLock,
    DRAFT: mdiPenLock,
};

const titles: Record<CollectionType, string> = {
    PUBLIC: 'Публичная коллекция - её видят все',
    PRIVATE: 'Приватная коллекция - её видят только те, у кого есть ссылка',
    DRAFT: 'Черновик - её видит только автор',
};

const CollectionVisibilityIcon: React.FC<ICollectionVisibilityIconProps> = (props: ICollectionVisibilityIconProps) => {
    const type = props.collection.type;
    return icons[type] && (
        <Icon
            className="collection-visibility-icon"
            path={icons[type]}
            title={titles[type]}
            aria-label={titles[type]}/>
    );
};

export default CollectionVisibilityIcon;
