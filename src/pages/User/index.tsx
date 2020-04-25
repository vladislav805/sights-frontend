import * as React from 'react';
import './style.scss';
import LoadingWrapper from '../../components/LoadingWrapper';
import { withRouter, RouteComponentProps, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { RootStore, setSession, TypeOfConnect } from '../../redux';
import API, { IApiError, IUser, IUserAchievements } from '../../api';
import { renderAchievements } from './achievements';
import { getLastSeen } from './lastSeen';
import SightsOfUser from './sights';
import InfoSplash from '../../components/InfoSplash';
import { mdiAccountQuestion } from '@mdi/js';
import Button from '../../components/Button';

const storeEnhancer = connect(
    (state: RootStore) => ({ ...state }),
    { setSession },
    null,
    { pure: false },
);

interface IUserRouterProps {
    username: string;
}

type IUserProps = TypeOfConnect<typeof storeEnhancer> & RouteComponentProps<IUserRouterProps>;

export type IProfile = {
    user: IUser;
    achievements: IUserAchievements | IApiError;
};

const apiGetProfile = async(username: string): Promise<IProfile> => API.execute<IProfile>('l=getArg l;u=call users.get -userIds $l -extra "photo,city";u=$u/0;i=$u/userId;a=call users.getAchievements -userId $i;r=new object;set $r -f user,achievements -v $u,$a; ret $r', {
    l: username,
});

const User: React.FC<IUserProps> = props => {
    const username = props?.match.params.username;
    const currentUser = props?.user;
    const [info, setInfo] = React.useState<IProfile | undefined>();

    React.useEffect(() => {
        apiGetProfile(username).then(setInfo);
    }, []);

    const user = info?.user;
    const isCurrentUser = user && currentUser && user.userId === currentUser.userId;

    if (info && !user) {
        return (
            <InfoSplash
                icon={mdiAccountQuestion}
                title="Пользователь не найден"
                description="Возможно, он был удалён или Вам дали неправильную ссылку" />
        );
    }

    return (
        <LoadingWrapper
            loading={!info}
            render={() => (
                <div className="profile">
                    <div className="profile-header">
                        <img
                            className="profile-photo"
                            src={user.photo.photo200}
                            alt="Photo" />
                        <div className="profile-content">
                            <h1>{user.firstName} {user.lastName}</h1>
                            <h3>@{user.login}</h3>
                            <h4>{user.city && <Link to={`/city/${user.city.cityId}`}>{user.city.name}</Link>}</h4>
                            {user.bio && <p>{user.bio}</p>}
                            <div className="profile-seen">{getLastSeen(user)}</div>
                            <div className="profile-actions">
                                {isCurrentUser && <Link className="xButton xButton__primary xButton__size-xs" to="/island/settings?tab=profile">Редактировать</Link>}
                            </div>
                        </div>
                    </div>
                    {!('errorId' in info.achievements) && renderAchievements(info.achievements)}
                    <SightsOfUser user={user} />
                </div>
            )} />
    );
};

export default withRouter(storeEnhancer(User));
