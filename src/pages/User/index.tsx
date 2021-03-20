import * as React from 'react';
import './style.scss';
import { useParams } from 'react-router-dom';
import { mdiAccountQuestion } from '@mdi/js';
import { apiExecute } from '../../api';
import InfoSplash from '../../components/InfoSplash';
import LoadingSpinner from '../../components/LoadingSpinner';
import ProfileAchievementBlock from './achievements';
import { IUser, IUserAchievements } from '../../api/types/user';
import PageTitle from '../../components/PageTitle';
import { ProfileHeader } from './header';
import { ProfileContent } from './content';
import { ProfileGallery } from './gallery';
import useApiFetch from '../../hook/useApiFetch';
import { IRank } from '../../api/types/rank';

type IUserRouterProps = {
    username: string;
};

type IResult = {
    user: IUser;
    achievements: IUserAchievements;
    rank: IRank;
};

const fetcherFactory = (username: string) => () => apiExecute<IResult>(
    'const id=A.id,u=API.users.get({userIds:id,fields:A.f});return{user:u[0],'
    + 'achievements:API.users.getAchievements({userId:u[0]?.userId}),'
    + 'rank:API.users.getRanks({rankIds:u[0]?.rank.rankId})[0]};', {
        id: username,
        f: ['ava', 'city', 'followers', 'isFollowed', 'rating', 'rank'],
    },
);

const User: React.FC = () => {
    const params = useParams<IUserRouterProps>();
    const fetcher = React.useMemo(() => fetcherFactory(params.username), []);

    const [user, setUser] = React.useState<IUser>();

    const { result, loading, error } = useApiFetch(fetcher);

    React.useEffect(() => {
        setUser(result?.user);
    }, [result?.user]);

    if (loading) {
        return <LoadingSpinner block size="l" />;
    }

    if (!user || error) {
        return (
            <InfoSplash
                icon={mdiAccountQuestion}
                title="Пользователь не найден"
                description="Возможно, он был удалён или Вам дали неправильную ссылку" />
        );
    }

    return (
        <div>
            <PageTitle>
                Профиль @
                {user.login}
            </PageTitle>
            <div className="profile">
                <ProfileHeader user={user} setUser={setUser} />
                <ProfileContent user={user} rank={result.rank} />
                { /* <ProfileActions user={user} setUser={setUser} /> */ }
                <ProfileAchievementBlock achievements={result.achievements} />
            </div>
            <ProfileGallery user={user} />
        </div>
    );
};

export default User;
