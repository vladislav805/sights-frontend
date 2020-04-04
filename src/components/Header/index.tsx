import * as React from 'react';
import './style.scss';
import { connect } from 'react-redux';
import { mdiAccount, mdiAccountCircle } from '@mdi/js';
import Logo from '../Logo';
import { IUser } from '../../api';
import { RootStore, setSession, TypeOfConnect } from '../../session';
import { Link } from 'react-router-dom';
import LinkIcon from '../LinkIcon';
import Icon from '@mdi/react';

const storeEnhancer = connect(
    (state: RootStore) => ({ ...state }),
    { setSession },
    null,
    { pure: false },
);

type IHeader = TypeOfConnect<typeof storeEnhancer>;

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

const Header = (props: IHeader) => {
    const isAuthorized = !!props.user;

    return (
        <div className="head">
            <div className="head-container">
                <div className="head-left">
                    <div className="head-logo">
                        <Logo size={2} />
                    </div>
                </div>

                <div className="head-user">
                    {isAuthorized ? UserButtons(props.user) : LoginButton}
                </div>
            </div>
        </div>
    );
};

export default storeEnhancer(Header);
