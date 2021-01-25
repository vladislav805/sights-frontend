import * as React from 'react';
import './style.scss';
import { Link, RouteComponentProps, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { RootStore, TypeOfConnect } from '../../redux';
import API, { apiExecute } from '../../api';
import { getLastSeen } from './lastSeen';
import InfoSplash from '../../components/InfoSplash';
import { mdiAccountEdit, mdiAccountMinus, mdiAccountPlus, mdiAccountQuestion, mdiBookmark } from '@mdi/js';
import LoadingSpinner from '../../components/LoadingSpinner';
import Button from '../../components/Button';
import SightsGallery from '../../components/SightsGallery/SightsGallery';
import { genderize } from '../../utils';
import { withWaitCurrentUser } from '../../hoc/withWaitCurrentUser';
import UserAchievementBlock from './achievements';
import { IUser, IUserAchievements } from '../../api/types/user';
import { ISight } from '../../api/types/sight';
import PageTitle from '../../components/PageTitle';
import FollowButton from '../../components/FollowButton';

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


    React.useEffect(() => nextSights(), [user?.userId]);

    const renderNothing = React.useCallback(() => (
        <div className="profile-sightGallery__empty">
            {user.firstName} ничего не {genderize(user, 'добавлял', 'добавляла')} :(
        </div>
    ), [user]);

    if (loading) {
        return <LoadingSpinner block size="l" />;
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
            <PageTitle>Профиль {user && `@${user.login}`}</PageTitle>
            <div className="profile-container">
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
                            {isCurrentUser && (
                                <Button
                                    icon={mdiAccountEdit}
                                    label="Редактировать"
                                    link="/island/settings?tab=profile" />
                            )}
                            <FollowButton
                                user={user}
                                onFollowStateChanged={setUser} />
                            {!isCurrentUser && (
                                <Button
                                    icon={mdiBookmark}
                                    label="Коллекции"
                                    link={`/collections/${user.userId}`} />
                            )}
                        </div>
                    </div>
                </div>
                <UserAchievementBlock
                    achievements={achievements}
                    sex={user.sex} />
            </div>
            {count === -1 ? <LoadingSpinner block /> : <SightsGallery
                key={user.userId}
                count={count}
                items={items}
                next={nextSights}
                whenNothing={renderNothing} />}
        </div>
    );
};

export default withWaitCurrentUser(withRouter(withStore(User)));
