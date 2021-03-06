import * as React from 'react';
import { Link } from 'react-router-dom';
import { IUser } from '../../api/types/user';
import FollowButton from '../../components/FollowButton';

type IProfileHeaderProps = {
    user: IUser;
    setUser: (user: IUser) => void;
};

export const ProfileHeader: React.FC<IProfileHeaderProps> = ({ user, setUser }: IProfileHeaderProps) => (
    <div className="profile-header">
        <div
            className="profile-header--background"
            style={{
                '--header-profile-image-url': `url(${user.photo?.photo200})`,
            } as React.CSSProperties} />
        <div className="profile-header--content">
            <img
                className="profile-header--photo"
                src={user.photo?.photo200}
                alt="User ava" />
            <div className="profile-header--info">
                <h1>{`${user.firstName} ${user.lastName}`}</h1>
                <h2>{`@${user.login}`}</h2>
                <h4>{user.city && <Link to={`/search/users?cityId=${user.city.cityId}`}>{user.city.name}</Link>}</h4>
                <FollowButton
                    className="profile-header--follow"
                    user={user}
                    onFollowStateChanged={setUser} />
            </div>
        </div>
    </div>
);
