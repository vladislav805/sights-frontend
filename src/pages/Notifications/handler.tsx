/* eslint-disable spaced-comment */
/*import * as React from 'react';
import { IPhoto, IUsableEvent, EventType } from '../../api';
import { Link } from 'react-router-dom';
import { mdiCheckDecagram, mdiCloseCircle, mdiCommentPlus, mdiThumbsUpDown } from '@mdi/js';

export type IFeedItemPreview = {
    photo: IPhoto;
    link: string;
};

interface IFeedItemSplit {
    photo?: IFeedItemPreview;
    content: React.ReactChild;
    object?: IFeedItemPreview;
    icon: string;
}

const text: Record<EventType, string> = {
    [EventType.SIGHT_VERIFIED]: 'подтвердил Вашу достопримечательность',
    [EventType.SIGHT_ARCHIVED]: 'заархивировал Вашу достопримечательность',
    [EventType.COMMENT_ADDED]: 'добавил комментарий к Вашей достопримечательности',
    [EventType.RATING_CHANGE]: 'оценил Вашу достопримечательность',
};

const icons: Record<EventType, string> = {
    [EventType.SIGHT_VERIFIED]: mdiCheckDecagram,
    [EventType.SIGHT_ARCHIVED]: mdiCloseCircle,
    [EventType.COMMENT_ADDED]: mdiCommentPlus,
    [EventType.RATING_CHANGE]: mdiThumbsUpDown,
};

const handleFeedItem = (feed: IUsableEvent): IFeedItemSplit => {
    let photo: IFeedItemPreview;
    let content: React.ReactChild;
    let object: IFeedItemPreview;

    const { actionUser, sight } = feed;

    switch (feed.type) {
        case EventType.SIGHT_VERIFIED:
        case EventType.SIGHT_ARCHIVED:
        case EventType.RATING_CHANGE: {
            photo = {
                photo: actionUser.photo,
                link: `/user/${actionUser.login}`,
            };
            content = (
                <>
                    <Link
                        to={`/user/${actionUser.login}`}>
                        {`${actionUser.firstName} ${actionUser.lastName}`.trim()}
                    </Link>
                    {` ${text[feed.type]} `}
                    <Link
                        to={`/sight/${sight.sightId}`}>
                        {sight.title}
                    </Link>
                </>
            );
            object = {
                photo: sight.photo,
                link: `/sight/${sight.sightId}`,
            };
            break;
        }

    }

    const icon = icons[feed.type];

    return { photo, content, object, icon };
};

export default handleFeedItem;
*/
