import * as React from 'react';
import './style.scss';
import { Link, RouteComponentProps, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { RootStore, TypeOfConnect } from '../../redux';
import API, { apiExecute, ISight, IUser, IUserAchievements } from '../../api';
import { getLastSeen } from './lastSeen';
import InfoSplash from '../../components/InfoSplash';
import { mdiAccountQuestion } from '@mdi/js';
import LoadingSpinner from '../../components/LoadingSpinner';
import withSpinnerWrapper from '../../components/LoadingSpinner/wrapper';
import Button from '../../components/Button';
import SightsGallery from '../../components/SightsGallery/SightsGallery';
import { genderize } from '../../utils';
import { withAwaitForUser } from '../../hoc/withAwaitForUser';
import UserAchievementBlock from './achievements';

const withStore = connect(
    (state: RootStore) => ({ ...state }),
    {},
    null,
    { pure: false },
);

type IUserRouterProps = {
    username: string;
};

export type IUserProps = TypeOfConnect<typeof withStore> & RouteComponentProps<IUserRouterProps>;

export type IProfile = {
    user: IUser;
};

const User: React.FC<IUserProps> = (props: IUserProps) => {
    const username = props?.match.params.username;
    const currentUser = props?.user;

    const [loading, setLoading] = React.useState<boolean>(true);
    const [user, setUser] = React.useState<IUser>(undefined);

    const [followBusy, setFollowBusy] = React.useState<boolean>(false);

    const [count, setCount] = React.useState<number>(-1);
    const [items, setItems] = React.useState<ISight[]>([]);

    const [achievements, setAchievements] = React.useState<IUserAchievements>();

    React.useEffect(() => {
        type IResult = {
            user: IUser;
            achievements: IUserAchievements;
        };
        void apiExecute<IResult>(
            'const id=A.id,u=API.users.get({userIds:id,fields:A.f});return{user:u[0],achievements:API.users.getAchievements({userId:u[0]?.userId})};', {
            id: username,
            f: ['ava', 'city', 'followers', 'isFollowed', 'rating'],
        }).then(data => {
            setUser(data.user);
            setAchievements(data.achievements);
            setLoading(false);
        });
    }, [username]);

    const nextSights = () => {
        if (!user) {
            return;
        }
        void API.sights.getByUser({
            ownerId: user.userId,
            count: 50,
            offset: items.length,
            fields: ['photo'],
        })
            .then(res => {
                setCount(res.count);
                setItems(items.concat(res.items));
            });

        return () => {
            setCount(-1);
            setItems([]);
        };
    };

    const toggleFollow = async() => {
        setFollowBusy(true);
        const { count } = await API.users.follow(user.userId, !user.isFollowed);
        setFollowBusy(false);
        setUser({
            ...user,
            isFollowed: !user.isFollowed,
            followers: count,
        });
    };

    React.useEffect(() => nextSights(), [user?.userId]);

    const renderNothing = React.useCallback(() => (
        <div className="profile-sightGallery__empty">
            {user.firstName} ничего не {genderize(user, 'добавлял', 'добавляла')} :(
        </div>
    ), [user]);

    if (loading) {
        return withSpinnerWrapper(<LoadingSpinner size="l" />);
    }

    const isCurrentUser = user && currentUser && user.userId === currentUser.userId;

    if (!user) {
        return (
            <InfoSplash
                icon={mdiAccountQuestion}
                title="Пользователь не найден"
                description="Возможно, он был удалён или Вам дали неправильную ссылку" />
        );
    }

    return (
        <div className="profile">
            <div className="profile-header">
                <img
                    className="profile-photo"
                    src={user.photo?.photo200}
                    alt="Photo" />
                <div className="profile-content">
                    <h1>{user.firstName} {user.lastName}</h1>
                    <h3>@{user.login}</h3>
                    <h4>{user.city && <Link to={`/city/${user.city.cityId}`}>{user.city.name}</Link>}</h4>
                    <div className="profile-bio">{user.bio}</div>
                    <div className="profile-seen">{getLastSeen(user)}</div>
                    <div className="profile-followers">Подписчиков: {user.followers}</div>
                    <div className="profile-actions">
                        {isCurrentUser && <Link className="xButton xButton__primary xButton__size-xs" to="/island/settings?tab=profile">Редактировать</Link>}
                        {currentUser && !isCurrentUser && (
                            <Button
                                className="xButton xButton__primary xButton__size-xs"
                                label={user.isFollowed ? 'Отписаться' : 'Подписаться'}
                                loading={followBusy}
                                onClick={toggleFollow} />
                        )}
                    </div>
                </div>
            </div>
            <UserAchievementBlock achievements={achievements} />
            {count === -1 ? withSpinnerWrapper(<LoadingSpinner />) : <SightsGallery
                key={user.userId}
                count={count}
                items={items}
                next={nextSights}
                whenNothing={renderNothing} />}
        </div>
    );
};

export default withAwaitForUser(withRouter(withStore(User)));
