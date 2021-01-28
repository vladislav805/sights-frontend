import * as React from 'react';
import './style.scss';
import { useParams } from 'react-router-dom';
import { apiExecute } from '../../api';
import InfoSplash from '../../components/InfoSplash';
import { mdiAccountQuestion } from '@mdi/js';
import LoadingSpinner from '../../components/LoadingSpinner';
import ProfileAchievementBlock from './achievements';
import { IUser, IUserAchievements } from '../../api/types/user';
import PageTitle from '../../components/PageTitle';
import { ProfileHeader } from './header';
import { ProfileContent } from './content';
import { ProfileGallery } from './gallery';

type IUserRouterProps = {
    username: string;
};

export type IProfile = {
    user: IUser;
};

const User: React.FC = () => {
    const params = useParams<IUserRouterProps>();
    const username = params.username;

    const [loading, setLoading] = React.useState<boolean>(true);
    const [user, setUser] = React.useState<IUser>();

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

    if (loading) {
        return <LoadingSpinner block size="l" />;
    }

    if (!user) {
        return (
            <InfoSplash
                icon={mdiAccountQuestion}
                title="Пользователь не найден"
                description="Возможно, он был удалён или Вам дали неправильную ссылку" />
        );
    }

    return (
        <div>
            <PageTitle>Профиль {user && `@${user.login}`}</PageTitle>
            <div className="profile">
                <ProfileHeader user={user} setUser={setUser} />
                <ProfileContent user={user} />
                { /*<ProfileActions user={user} setUser={setUser} /> */ }
                <ProfileAchievementBlock user={user} achievements={achievements} />
            </div>
            <ProfileGallery user={user} />
        </div>
    );
};

export default User;
