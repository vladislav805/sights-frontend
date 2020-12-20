import * as React from 'react';
import './style.scss';
import { connect } from 'react-redux';
import { mdiAccount, mdiAccountCircle, mdiMapMarkerPlus } from '@mdi/js';
import Logo from '../Logo';
import { IUser } from '../../api';
import { RootStore, TypeOfConnect } from '../../redux';
import { Link } from 'react-router-dom';
import Icon from '@mdi/react';

const withStore = connect(
    (state: RootStore) => ({ ...state }),
    {},
    null,
    { pure: false },
);

type IHeader = TypeOfConnect<typeof withStore> & {
    menuState: boolean;
    setMenuState: (state: boolean) => void;
};

const LoginButton = (
    <Link
        to="/island/login"
        title="Авторизация"
        className="head--link">
        <Icon
            path={mdiAccount}
            color="white" />
    </Link>
);

const UserButtons = (user: IUser) => (
    <>
        <Link
            to="/sight/new"
            title="Добавить новую достопримечательность"
            className="head--link">
            <Icon
                path={mdiMapMarkerPlus}
                color="white" />
        </Link>
        <Link
            to={`/user/${user.login}`}
            title={`Вы зашли как @${user.login}`}
            className="head--link head--link__user">
            {user.photo ? (
                <img
                    className="head--link__user-avatar"
                    src={user.photo.photo200}
                    alt="Thumb" />
            ) : (
                <Icon
                    path={mdiAccountCircle}
                    color="white" />
            )}
        </Link>
    </>
);

const Header = ({ user, menuState, setMenuState }: IHeader) => {
    const isAuthorized = !!user;

    const toggleMenuState = () => {
        setMenuState(!menuState);
    };

    return (
        <div className="head">
            <div className="head-container">
                <div className="head-left">
                    <div className="head-logo" onClick={toggleMenuState}>
                        <Logo size={2} />
                    </div>
                </div>

                <div className="head-user">
                    {isAuthorized ? UserButtons(user) : LoginButton}
                </div>
            </div>
        </div>
    );
};

export default withStore(Header);
