import * as React from 'react';
import './style.scss';
import { connect } from 'react-redux';
import { mdiAccount, mdiAccountCircle, mdiMapMarkerPlus } from '@mdi/js';
import Logo from '../Logo';
import { IUser } from '../../api';
import { RootStore, setSession, TypeOfConnect } from '../../redux';
import { Link } from 'react-router-dom';
import LinkIcon from '../LinkIcon';
import Icon from '@mdi/react';

const storeEnhancer = connect(
    (state: RootStore) => ({ ...state }),
    { setSession },
    null,
    { pure: false },
);

interface IHeader extends TypeOfConnect<typeof storeEnhancer> {
    menuState: boolean;
    setMenuState: (state: boolean) => void;
}

const LoginButton = (
    <LinkIcon
        to="/island/login"
        path={mdiAccount}
        color="transparent"
        className="head-user--button"
        iconSize={2}
        iconColor="#ffffff" />
);

const UserButtons = (user: IUser) => (
    <>
        <Link
            to="/sight/new"
            title="Добавить новую достопримечательность"
            className="head-user--button">
            <Icon
                path={mdiMapMarkerPlus}
                size="2rem"
                color="white" />
        </Link>
        <Link
            to={`/user/${user.login}`}
            title={`Вы зашли как @${user.login}`}
            className="head-user--button head-user--userlink">
            {user.photo ? (
                <img
                    className="head-user--avatar"
                    src={user.photo.photo200}
                    alt="Thumb" />
            ) : (
                <Icon
                    path={mdiAccountCircle}
                    size="3rem"
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

export default storeEnhancer(Header);
