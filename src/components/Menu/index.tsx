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
};

type IMenuSplitter = { line: number };

const getItems = (user: IUser): (IMenuItem | IMenuSplitter)[] => {
    const isUser = !!user;
    return [
        { link: '/', label: 'Главная' },
        isUser && { link: `/user/${user.login}`, label: `${user.firstName} ${user.lastName}` },
        { link: '/sight/map', label: 'Карта' },
        { link: '/sight/search', label: 'Поиск' },
        { link: '/sight/random', label: 'Случайное место' },
        isUser && { link: '/feed', label: 'События' },
        { line: 147 },
        isUser && { link: '/island/settings', label: 'Настройки' },
        isUser && { link: '/island/logout', label: 'Выход' },
        !isUser && { link: '/island/login', label: 'Авторизация' },
        !isUser && { link: '/island/register', label: 'Регистрация' },

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
                            {item.label}
                        </Link>
                    );
                })}
            </div>
        </div>
        <MenuOverlay show={isOpen} close={close} />
    </>
);

export default storeEnhancer(Menu);
