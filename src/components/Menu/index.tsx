import * as React from 'react';
import './style.scss';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { TypeOfConnect, RootStore } from '../../redux';
import MenuOverlay from './overlay';
import { IUser } from '../../api';
import { Link } from 'react-router-dom';
import { mdiAccountCircle, mdiMapSearch, mdiHome, mdiSearchWeb, mdiAutoFix, mdiBell, mdiCog, mdiAccountCancel, mdiAccountTie, mdiAccountPlus } from '@mdi/js';
import Icon from '@mdi/react';

const storeEnhancer = connect(
    (state: RootStore) => ({ ...state }),
    {},
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
    icon: string;
};

type IMenuSplitter = { line: number };

const getItems = (user: IUser): (IMenuItem | IMenuSplitter)[] => {
    const isUser = !!user;
    return [
        { link: '/', label: 'Главная', icon: mdiHome },
        isUser && { link: `/user/${user.login}`, label: `${user.firstName} ${user.lastName}`, icon: mdiAccountCircle },
        { link: '/sight/map', label: 'Карта', icon: mdiMapSearch },
        { link: '/sight/search', label: 'Поиск', icon: mdiSearchWeb },
        { link: '/sight/random', label: 'Случайное место', icon: mdiAutoFix },
        isUser && { link: '/feed', label: 'События', icon: mdiBell },
        { line: 147 },
        isUser && { link: '/island/settings', label: 'Настройки', icon: mdiCog },
        isUser && { link: '/island/logout', label: 'Выход', icon: mdiAccountCancel },
        !isUser && { link: '/island/login', label: 'Авторизация', icon: mdiAccountTie },
        !isUser && { link: '/island/register', label: 'Регистрация', icon: mdiAccountPlus },

    ].filter(Boolean);
};

const Menu = ({ user, isOpen, close }: IMenuProps) => (
    <>
        <div className={classNames('menu', {
            'menu__open': isOpen,
        })}>
            <div className="menu-content">
                {getItems(user).map(item => {
                    if ((item as IMenuSplitter).line) {
                        return <hr key={(item as IMenuSplitter).line} />;
                    }

                    item = item as IMenuItem;
                    return (
                        <Link
                            key={item.link}
                            to={item.link}
                            onClick={close}
                            className="menu-item">
                            <Icon className="menu-item--icon" path={item.icon} />
                            <span className="menu-item--label">{item.label}</span>
                        </Link>
                    );
                })}
            </div>
        </div>
        <MenuOverlay show={isOpen} close={close} />
    </>
);

export default storeEnhancer(Menu);
