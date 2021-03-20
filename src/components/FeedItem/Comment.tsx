import * as React from 'react';
import { Link } from 'react-router-dom';
import { genderize } from '../../utils/genderize';
import { IUser } from '../../api/types/user';
import { IFeedBaseProps } from './common';
import { IFeedItemCollection } from '../../api/types/feed';

export const getCollectionFeedItemHeader = (user: IUser): React.ReactNode =>
    `${genderize(user, 'создал', 'создала')} коллекцию`;

export const CollectionFeedItem: React.FC<IFeedBaseProps<IFeedItemCollection>> = ({
    item,
    collections,
}: IFeedBaseProps<IFeedItemCollection>) => {
    const collection = collections.get(item.collectionId);
    return (
        <div className="">
            <h4><Link to={`/collection/${collection.collectionId}`}>{collection.title}</Link></h4>
        </div>
    );
};
