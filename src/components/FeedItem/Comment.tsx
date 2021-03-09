import * as React from 'react';
import { genderize } from '../../utils/genderize';
import { IUser } from '../../api/types/user';
import { IFeedBaseProps } from './common';
import { Link } from 'react-router-dom';
import { IFeedItemCollection } from '../../api/types/feed';

export const getCollectionFeedItemHeader = (user: IUser): React.ReactNode =>
    `${genderize(user, 'создал', 'создала')} коллекцию`;

export const CollectionFeedItem: React.FC<IFeedBaseProps<IFeedItemCollection>> = (props: IFeedBaseProps<IFeedItemCollection>) => {
    const collection = props.collections.get(props.item.collectionId);
    return (
        <div className="">
            <h4><Link to={`/collection/${collection.collectionId}`}>{collection.title}</Link></h4>
        </div>
    );
};
