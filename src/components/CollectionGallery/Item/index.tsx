import * as React from 'react';
import './style.scss';
import { ICollection } from '../../../api/types/collection';
import { IUser } from '../../../api/types/user';
import { Format, humanizeDateTime, IPluralForms, pluralize } from '../../../utils';
import CollectionVisibilityIcon from '../../CollectionVisibilityIcon';

type ICollectionGalleryItemProps = {
    collection: ICollection;
    showCity?: boolean;
    user?: IUser;
};

const collectionSizePlural: IPluralForms = {
    one: 'место',
    many: 'места',
    some: 'мест',
};

const CollectionGalleryItem: React.FC<ICollectionGalleryItemProps> = ({ collection }: ICollectionGalleryItemProps) => {
    const infoString: string = [
        collection.size && `${collection.size} ${pluralize(collection.size, collectionSizePlural)}`,
        collection.cityId && `${collection.cityId}`,
    ].filter(Boolean).join(', ');
    return (
        <div className='collection-gallery-item'>
            <h4 className="collection-gallery-item--title">
                <a href={`/collection/${collection.collectionId}`}>{collection.title}</a>
                <CollectionVisibilityIcon collection={collection} />
            </h4>
            {infoString && <p className="collection-gallery-item--shortInfo">{infoString}</p>}
            <p className="collection-gallery-item--content">{collection.content}</p>
            <p className="collection-gallery-item--footer">
                Создано {humanizeDateTime(collection.dateCreated, Format.FULL)}
                {collection.dateUpdated > 0 && `, обновлено ${humanizeDateTime(collection.dateUpdated, Format.FULL)}`}
            </p>
        </div>
    );
};

export default CollectionGalleryItem;
