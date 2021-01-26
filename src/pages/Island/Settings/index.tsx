import * as React from 'react';
import { ITab, TabHost } from '../../../components/Tabs';
import { useLocation } from 'react-router-dom';
import { parseQueryString } from '../../../utils';
import Preferences from './preferences';
import ProfileSettings from './profile';
import Social from './social';

const tabs: ITab[] = [
    {
        name: 'site',
        title: 'Сайт',
        content: (<Preferences />),
    },
    {
        name: 'profile',
        title: 'Профиль',
        content: (<ProfileSettings />),
    },
    {
        name: 'photo',
        title: 'Фото',
        content: null,
    },
    {
        name: 'password',
        title: 'Пароль',
        content: null,
    },
    {
        name: 'notifications',
        title: 'Уведомления',
        content: null,
    },
    {
        name: 'social',
        title: 'Вход',
        content: (<Social />),
    },
];

const Settings: React.FC = () => {
    const location = useLocation();
    const qs = parseQueryString(location.search);
    return (
        <TabHost
            tabs={tabs}
            defaultSelected={qs.get('tab')}
            saveSelectedInLocation />
    );
}

export default Settings;
