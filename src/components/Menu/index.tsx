import * as React from 'react';
import './style.scss';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { TypeOfConnect, setSession, RootStore } from '../../session';
import MenuOverlay from './overlay';
import { IUser } from '../../api';
import { Link } from 'react-router-dom';

const storeEnhancer = connect(
    (state: RootStore) => ({ ...state }),
    { setSession },
    null,
    { pure: false },
);

interface IMenuProps extends TypeOfConnect<typeof storeEnhancer> {
    isOpen: boolean;
    close: () => void;
}

type IMenuItem = {
    link: string;
    label: string;
}

const getItems = (user: IUser): IMenuItem[] => {
    const isUser = !!user;
    return [
        { link: '/', label: 'Главная' },
        isUser && { link: `/user/${user.login}`, label: `${user.firstName} ${user.lastName}` },
        isUser && { link: '/feed', label: 'События' },
        !isUser && { link: '/island/login', label: 'Авторизация' },
    ].filter(Boolean);
};

const Menu = ({ user, isOpen, close }: IMenuProps) => (
    <>
        <div className={classNames('menu', {
            'menu__open': isOpen,
        })}>
            <div className="menu-content">
                {getItems(user).map(item => (
                    <Link
                        key={item.link}
                        to={item.link}
                        onClick={close}
                        className="menu-item">
                        {item.label}
                    </Link>
                ))}
            </div>
        </div>
        <MenuOverlay show={isOpen} close={close} />
    </>
);

export default storeEnhancer(Menu);
