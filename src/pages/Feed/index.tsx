import * as React from 'react';
import './style.scss';
import { connect } from 'react-redux';
import api, { IEventList, IUsableEvent, EventType } from '../../api';
import { entriesToMap } from '../../utils';
import { RootStore, TypeOfConnect } from '../../session';
import LoadingWrapper from '../../components/LoadingWrapper';
import FeedList from '../../components/FeedList';
import Button from '../../components/Button';

const storeEnhancer = connect(
    (state: RootStore) => ({ ...state }),
    { },
    null,
    { pure: false },
);

interface IFeedProps extends TypeOfConnect<typeof storeEnhancer> {

}

interface IFeedState {
    feed?: IUsableEvent[];
    countNew: number;
    countResetBusy: boolean;
}

class Feed extends React.Component<IFeedProps, IFeedState> {
    state: IFeedState = {
        feed: undefined,
        countNew: -1,
        countResetBusy: false,
    };

    componentDidMount() {
        if (this.props.user) {
            this.fetchFeed();
        }
    }

    componentDidUpdate(prevProps: IFeedProps) {
        if (prevProps.user !== this.props.user && this.props.user && this.state.feed === undefined) {
            this.fetchFeed();
        }
    }

    private fetchFeed = async() => {
        const rawFeed = await api<IEventList>('events.get', {
            extra: 'photo',
        });

        const feed = this.handleFeed(rawFeed);

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
            api<true>('events.readAll', {}).then(() => {
                this.setState({
                    feed: this.state.feed.map(item => {
                        item.isNew = false;
                        return item;
                    }),
                    countNew: 0,
                    countResetBusy: false,
                });
            });
        });
    };

    render() {
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
    }
}

export default storeEnhancer(Feed);
