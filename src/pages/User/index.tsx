import * as React from 'react';
import './style.scss';
import { Link, RouteComponentProps, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { RootStore, TypeOfConnect } from '../../redux';
import API, { IUser } from '../../api';
import { getLastSeen } from './lastSeen';
import InfoSplash from '../../components/InfoSplash';
import { mdiAccountQuestion } from '@mdi/js';
import LoadingSpinner from '../../components/LoadingSpinner';
import withSpinnerWrapper from '../../components/LoadingSpinner/wrapper';
import Button from '../../components/Button';

const withStore = connect(
    (state: RootStore) => ({ ...state }),
    {},
    null,
    { pure: false },
);

type IUserRouterProps = {
    username: string;
};

type IUserProps = TypeOfConnect<typeof withStore> & RouteComponentProps<IUserRouterProps>;

export type IProfile = {
    user: IUser;
};

const User: React.FC<IUserProps> = (props: IUserProps) => {
    const username = props?.match.params.username;
    const currentUser = props?.user;

    const [loading, setLoading] = React.useState<boolean>(true);
    const [user, setUser] = React.useState<IUser>(undefined);

    React.useEffect(() => {
        void API.users.getUser(username, ['ava', 'city', 'followers', 'isFollowing', 'rating'])
            .then(setUser)
            .then(() => setLoading(false));
    }, [username]);

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
                    {user.bio && <p>{user.bio}</p>}
                    <div className="profile-seen">{getLastSeen(user)}</div>
                    <div className="profile-followers">Подписчиков: {user.followers}</div>
                    <div className="profile-bio">{user.bio}</div>
                    <div className="profile-actions">
                        {isCurrentUser && <Link className="xButton xButton__primary xButton__size-xs" to="/island/settings?tab=profile">Редактировать</Link>}
                        {currentUser && !isCurrentUser && <Button className="xButton xButton__primary xButton__size-xs" label={user.isFollowing ? 'Отписаться' : 'Подписаться'} />}
                    </div>
                </div>
            </div>
            { /* !('errorId' in info.achievements) && renderAchievements(info.achievements) */ }
            { /*<SightsOfUser user={user} />*/ }
        </div>
    );
};

export default withRouter(withStore(User));
