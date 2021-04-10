import * as React from 'react';
import './style.scss';
import { Link } from 'react-router-dom';
import { ICollection } from '../../../api/types/collection';
import { IUser } from '../../../api/types/user';
import { IPluralForms, pluralize } from '../../../utils/pluralize';
import { Format, humanizeDateTime } from '../../../utils/date';
import CollectionVisibilityIcon from '../../CollectionVisibilityIcon';
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

const CollectionGalleryItem: React.FC<ICollectionGalleryItemProps> = ({
    collection,
    showCity = true,
    user,
}: ICollectionGalleryItemProps) => {
    let newLine = collection.content.indexOf('\n');

    if (newLine === -1) {
        newLine = 500;
    }

    return (
        <div className="collection-gallery-item">
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
                {collection.content.slice(0, Math.min(500, newLine))}
            </MarkdownRenderer>
            {!collection.isSystem
                ? (
                    <p className="collection-gallery-item--footer">
                        Создано {humanizeDateTime(collection.dateCreated, Format.FULL)}
                        {collection.dateUpdated > 0 && `, обновлено ${humanizeDateTime(collection.dateUpdated, Format.FULL)}`}
                    </p>
                )
                : (
                    <p className="collection-gallery-item--footer">Системная коллекция</p>
                )}
        </div>
    );
};

export default CollectionGalleryItem;
