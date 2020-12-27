import * as React from 'react';
import './style.scss';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { RootStore, TypeOfConnect } from '../../redux';
import MenuOverlay from './overlay';
import { Link } from 'react-router-dom';
import {
    mdiAccountCancel,
    mdiAccountCircle,
    mdiAccountTie,
    mdiCog,
    mdiHome,
    mdiMapSearch,
    mdiRss,
    mdiSearchWeb,
} from '@mdi/js';
import Icon from '@mdi/react';
import { IUser } from '../../api/types/user';

const withStore = connect(
    (state: RootStore) => ({ ...state }),
    {},
    null,
    { pure: false },
);

type IMenuProps = TypeOfConnect<typeof withStore> & {
    isOpen: boolean;
    close: () => void;
};

const enum Type {
    LINK,
    LINE,
}

type IMenuItem = IMenuLink | IMenuSplitter;

type IMenuLink = {
    type: Type.LINK;
    link: string;
    label: string;
    icon: string;
    show: boolean;
};

type IMenuSplitter = {
    type: Type.LINE;
    line: number;
};

const getItems = (user: IUser): IMenuItem[] => {
    const isUser = !!user;
    return [
        {
            type: Type.LINK,
            link: '/',
            label: 'Главная',
            icon: mdiHome,
            show: true,
        },
        {
            type: Type.LINK,
            link: isUser && `/user/${user.login}`,
            label: isUser && `${user.firstName} ${user.lastName}`,
            icon: mdiAccountCircle,
            show: isUser,
        },
        {
            type: Type.LINK,
            link: '/sight/map',
            label: 'Карта',
            icon: mdiMapSearch,
            show: true,
        },
        {
            type: Type.LINK,
            link: '/sight/search',
            label: 'Поиск',
            icon: mdiSearchWeb,
            show: true,
        },
        {
            type: Type.LINK,
            link: '/feed',
            label: 'События',
            icon: mdiRss,
            show: isUser,
        },
        /*{
            type: Type.LINK,
            link: '/notifications',
            label: 'Уведомления',
            icon: mdiBell,
            show: isUser,
        },*/
        {
            type: Type.LINE,
            line: 147,
        },
        {
            type: Type.LINK,
            link: '/island/settings',
            label: 'Настройки',
            icon: mdiCog,
            show: isUser,
        },
        {
            type: Type.LINK,
            link: '/island/logout',
            label: 'Выход',
            icon: mdiAccountCancel,
            show: isUser,
        },
        {
            type: Type.LINK,
            link: '/island/login',
            label: 'Авторизация',
            icon: mdiAccountTie,
            show: !isUser,
        },
    ];
};

const Menu = ({ user, isOpen, close }: IMenuProps) => (
    <>
        <div className={classNames('menu', {
            'menu__open': isOpen,
        })}>
            <div className="menu-content">
                {getItems(user).map(item => {
                    if (item.type === Type.LINE) {
                        return <hr key={item.line} />;
                    }

                    return item.show && (
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

export default withStore(Menu);
