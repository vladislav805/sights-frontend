import * as React from 'react';
import { Link } from 'react-router-dom';
import { genderize } from '../../utils/genderize';
import { IUser } from '../../api/types/user';
import { IFeedBaseProps } from './common';
import { IFeedItemComment } from '../../api/types/feed';

export const getCommentFeedItemHeader = (props: IFeedBaseProps<IFeedItemComment>, user: IUser): React.ReactNode => {
    const { item, sights, collections } = props;
    const isSight = Boolean(item.sightId);
    const subject = isSight
        ? 'достопримечательности '
        : 'коллекции ';

    const object = isSight
        ? sights.get(item.sightId)
        : collections.get(item.collectionId);

    return (
        <>
            {genderize(user, 'написал', 'написала')} комментарий к {subject}
            <Link to={isSight ? `/sight/${item.sightId}` : `/collection/${item.collectionId}`}>{object.title}</Link>
        </>
    );
};

export const CommentFeedItem: React.FC<IFeedBaseProps<IFeedItemComment>> = ({
    item,
    comments,
}: IFeedBaseProps<IFeedItemComment>) => {
    const comment = comments.get(item.commentId);
    return (
        <>
            <p>{comment.text}</p>
        </>
    );
};
