/* eslint-disable */
import * as React from 'react';
import './style.scss';
// import handleFeedItem, { IFeedItemPreview } from '../../pages/Notifications/handler';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import { mdiImage } from '@mdi/js';
import Icon from '@mdi/react';
import { INotification } from '../../api/types/notification';
/*
interface IFeedItemProps {
    item: INotification;
}

interface IPreviewProps {
    // preview?: IFeedItemPreview;
    className?: string;
    icon?: string;
}

const Preview = ({
    preview: { link, photo },
    className = '',
    icon,
}: IPreviewProps) => (
    <Link to={link} className={className}>
        {photo
            ? <img src={photo?.photo200} alt="Preview" />
            : <Icon path={mdiImage} className="feed-item--preview" />
        }
        {icon && <Icon path={icon} className="feed-item--icon" />}
    </Link>
);*/

type IFeedItemProps = { item: null };

const FeedItem: React.FC<IFeedItemProps> = ({ item }: IFeedItemProps) => {
    return null;
    /*const { photo, content, object, icon } = handleFeedItem(item);
    return (
        <div className={classNames('feed-item', {
            'feed-item__unread': item.isNew
        })}>
            {photo && (
                <Preview
                    className="feed-item--userPhoto"
                    preview={photo} />
            )}
            <div className="feed-item--content">
                {content}
            </div>
            {object && (
                <Preview
                    className="feed-item--object"
                    preview={object}
                    icon={icon} />
            )}
        </div>
    );*/
};

export default FeedItem;
