import * as React from 'react';
import './style.scss';
import LoadingWrapper from '../../components/LoadingWrapper';
import { withRouter, RouteComponentProps, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { RootStore, setSession, TypeOfConnect } from '../../session';
import api, { IUser, IUserAchievements, UserSex } from '../../api';
import pluralize, { IPluralForms } from '../../utils/pluralize';

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

type IProfile = {
    user: IUser;
    achievements: IUserAchievements;
}

const apiGetProfile = async(username: string): Promise<IProfile> => api<IProfile>('execute.compile', {
    code: 'l=getArg l;u=call users.get -userIds $l -extra "photo,city";u=$u/0;i=$u/userId;a=call users.getAchievements -userId $i;r=new object;set $r -f user,achievements -v $u,$a; ret $r',
    l: username,
});

const genderifiedActions: Record<string, Record<UserSex, string>> = {
    added: { MALE: 'добавил', FEMALE: 'добавила', NOT_SET: 'добавило' },
    visited: { MALE: 'посетил', FEMALE: 'посетила', NOT_SET: 'посетило' },
    uploaded: { MALE: 'зарузил', FEMALE: 'загрузила', NOT_SET: 'загрузило' },
    wrote: { MALE: 'написал', FEMALE: 'написала', NOT_SET: 'написало' },
};

const places = {
    one: 'место',
    some: 'места',
    many: 'мест',
};

const renderAchievements = ({ user, achievements: a }: IProfile) => {
    const line = (action: string, value: number, noun: IPluralForms) => {
        return `${genderifiedActions[action][user.sex]} ${value} ${pluralize(value, noun)}`
    }
    const lines: string[] = [
        line('added', a.authorOfAllSights, places),
        line('visited', a.visitedSights, places),
        line('uploaded', a.photosOfSights, {
            one: 'фотографию',
            some: 'фотографии',
            many: 'фотографий',
        }),
        line('wrote', a.comments, {
            one: 'комментарий',
            some: 'комментария',
            many: 'комментариев',
        }),
    ];

    return lines.join('\n');
};

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
                    <div className="profile-photo">
                        <img src={user.photo.photo200} alt="Photo" />
                    </div>
                    <div className="profile-content">
                        <h2>{user.firstName} {user.lastName}</h2>
                        <h3>@{user.login}</h3>
                        <div className="profile-seen">{user.lastSeen}</div>
                        <h4>{user.city && <Link to={`/city/${user.city.cityId}`}>{user.city.name}</Link>}</h4>
                        <div className="profile-achievements">{renderAchievements(info)}</div>
                        {isCurrentUser && <Link to="/island/edit">Редактировать</Link>}
                    </div>
                </div>
            )} />
    );
};

export default withRouter(storeEnhancer(User));
