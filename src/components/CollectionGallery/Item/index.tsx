import * as React from 'react';
import './style.scss';
import { ICollection } from '../../../api/types/collection';
import { IUser } from '../../../api/types/user';
import { Format, humanizeDateTime, IPluralForms, pluralize } from '../../../utils';
import CollectionVisibilityIcon from '../../CollectionVisibilityIcon';
import { Link } from 'react-router-dom';
import MarkdownRenderer from '../../MarkdownRenderer';
import JoinWithComma from '../../JoinWithComma';

type ICollectionGalleryItemProps = {
    collection: ICollection;
    showCity?: boolean;
    user?: IUser;
};

const collectionSizePlural: IPluralForms = {
    one: 'место',
    some: 'места',
    many: 'мест',
};

const CollectionGalleryItem: React.FC<ICollectionGalleryItemProps> = ({ collection, showCity = true, user }: ICollectionGalleryItemProps) => {
    return (
        <div className='collection-gallery-item'>
            <h4 className="collection-gallery-item--title">
                <Link to={`/collection/${collection.collectionId}`}>{collection.title}</Link>
                <CollectionVisibilityIcon collection={collection} />
            </h4>
            <p className="collection-gallery-item--shortInfo">
                <JoinWithComma>
                    {user && (
                        <Link to={`/user/${user.login}`}>@{user.login}</Link>
                    )}
                    {collection.size > 0 && `${collection.size} ${pluralize(collection.size, collectionSizePlural)}`}
                    {showCity && collection.city && (
                        <Link to={`/sight/city?cityId=${collection.city.cityId}`}>{collection.city.name}</Link>
                    )}
                </JoinWithComma>
            </p>
            <MarkdownRenderer className="collection-gallery-item--preview">
                {collection.content.slice(0, 600)}
            </MarkdownRenderer>
            <p className="collection-gallery-item--footer">
                Создано {humanizeDateTime(collection.dateCreated, Format.FULL)}
                {collection.dateUpdated > 0 && `, обновлено ${humanizeDateTime(collection.dateUpdated, Format.FULL)}`}
            </p>
        </div>
    );
};

export default CollectionGalleryItem;
