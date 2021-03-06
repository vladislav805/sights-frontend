/* eslint-disable */
import * as React from 'react';
import './style.scss';
// import FeedList from '../../components/NotificationList';

type IFeedProps = never;

interface IFeedState {
    // feed?: IUsableEvent[];
    countNew: number;
    countResetBusy: boolean;
}

class Feed extends React.Component<IFeedProps, IFeedState> {

    /*
    componentDidMount() {
        void this.fetchFeed();
    }

    private fetchFeed = async() => {
        const rawFeed = await API.notifications.get();

        /const feed = this.handleFeed(rawFeed);

        const countNew = feed.reduce((acc, item) => {
            item.isNew && ++acc;
            return acc;
        }, 0);

       this.setState({ feed, countNew });
    };

    private handleFeed = (feed: IEventList): IUsableEvent[] => {
        const users = entriesToMap(feed.users, 'userId');
        const sights = entriesToMap(feed.sights, 'sightId');
        return (feed.items as unknown as IUsableEvent[]).map(item => {
            item.actionUser = users.get(item.actionUserId);
            switch (item.type) {
                case EventType.COMMENT_ADDED: {
                    break;
                }

                default: {
                    item.sight = sights.get(item.subjectId);
                }
            }

            return item;
        });
    };

    private resetReadFeed = () => {
        this.setState({ countResetBusy: true }, () => {
            void API.notifications.readAll().then(() => this.setState({
                feed: this.state.feed.map(item => {
                    item.isNew = false;
                    return item;
                }),
                countNew: 0,
                countResetBusy: false,
            }));
        });
    };
    */

    render(): JSX.Element {
        return null;
        /*
        return (
            <div className="feed">
                <div className="feed-head">
                    <h2>Последние события</h2>
                    {this.state.countNew > 0 && (
                        <Button
                            color="primary"
                            onClick={this.resetReadFeed}
                            loading={this.state.countResetBusy}
                            label={`Mark ${this.state.countNew} as viewed`}
                            />
                    )}
                </div>
                <LoadingWrapper
                    loading={!this.state.feed}
                    render={() =>
                        <FeedList items={this.state.feed} />
                    } />
            </div>
        );
        */
    }
}

export default Feed;
