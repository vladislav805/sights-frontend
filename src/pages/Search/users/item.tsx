import * as React from 'react';
import './style.scss';
import { Link } from 'react-router-dom';
import { IUser } from '../../../api/types/user';
import JoinWithComma from '../../../components/JoinWithComma';
import { pluralize } from '../../../utils';

type ISearchUserItemProps = {
    user: IUser;
};

export const SearchUserItem: React.FC<ISearchUserItemProps> = ({ user }: ISearchUserItemProps) => (
    <div className="search-item__user">
        <img
            className="search-item__user-photo"
            src={user.photo?.photo200}
            alt="Фотография пользователя" />
        <div className="search-item__user-content">
            <h4 className="search-item__user-content-name">
                <Link to={`/user/${user.login}`}>{user.firstName} {user.lastName}</Link>
            </h4>
            <p className="search-item__user-content-username">@{user.login}</p>
            <p className="search-item__user-content-shortInfo">
                <JoinWithComma>
                    {user.city && user.city.name}
                    {user.rank.title}
                    {`${user.rank.points} ${pluralize(user.rank.points, {
                        one: 'очко',
                        some: 'очка',
                        many: 'очков',
                    })}`}
                </JoinWithComma>
            </p>
        </div>
    </div>
);
