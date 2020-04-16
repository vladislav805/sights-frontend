import * as React from 'react';
import './style.scss';
import LoadingWrapper from '../../components/LoadingWrapper';
import { withRouter, RouteComponentProps, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { RootStore, setSession, TypeOfConnect } from '../../redux';
import API, { IUser, IUserAchievements } from '../../api';
import { renderAchievements } from './achievements';
import { getLastSeen } from './lastSeen';

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
    achievements: IUserAchievements;
};

const apiGetProfile = async(username: string): Promise<IProfile> => API.execute<IProfile>('l=getArg l;u=call users.get -userIds $l -extra "photo,city";u=$u/0;i=$u/userId;a=call users.getAchievements -userId $i;r=new object;set $r -f user,achievements -v $u,$a; ret $r', {
    l: username,
});

const User: React.FC<IUserProps> = props => {
    const username = props?.match.params.username;
    const currentUser = props?.user;
    const [info, setInfo] = React.useState<IProfile | null | undefined>(undefined);

    React.useEffect(() => {
        if (info === null) {
            return;
        }

        if (info === undefined) {
            setInfo(null);
            apiGetProfile(username).then(setInfo);
        }
    });

    const user = info?.user;
    const isCurrentUser = user && currentUser && user.userId === currentUser.userId;

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
                            {isCurrentUser && <Link to="/island/edit">Редактировать</Link>}
                        </div>
                    </div>
                    {renderAchievements(info.achievements)}
                </div>
            )} />
    );
};

export default withRouter(storeEnhancer(User));
