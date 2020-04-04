import * as React from 'react';
import './style.scss';
import { connect } from 'react-redux';
import { mdiAccount, mdiAccountCircle, mdiLogoutVariant } from '@mdi/js';
import { IAuthenticator } from '../../controllers';
import Logo from '../Logo';
import ButtonIcon from '../ButtonIcon';
import { IUser } from '../../api';
import { RootStore, setSession, TypeOfConnect } from '../../session';
import { Link } from 'react-router-dom';
import LinkIcon from '../LinkIcon';

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

const UserArea = (user: IUser, autheniticator: IAuthenticator) => (
    <>
        <Link
            to={mdiAccountCircle}
            //label={user.login}
            color="transparent"
            className="head-user--button"
            //iconSize={2}
            //iconColor="#ffffff"
            />
        <ButtonIcon
            path={mdiLogoutVariant}
            color="transparent"
            className="head-user--button"
            onClick={() => autheniticator.logout()}
            iconSize={2}
            iconColor="#ffffff" />
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
                    {isAuthorized ? props.user.login : LoginButton}
                </div>
            </div>
        </div>
    );
};

export default storeEnhancer(Header);
