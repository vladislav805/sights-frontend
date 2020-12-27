import * as React from 'react';
import { TabHost } from '../../../components/Tabs';
import { ITab } from '../../../components/Tabs';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { parseQueryString } from '../../../utils';
import Preferences from './preferences';
import ProfileSettings from './profile';
import Social from './social';

const tabs: ITab[] = [
    {
        name: 'site',
        title: 'Сайт',
        content: Preferences,
    },
    {
        name: 'profile',
        title: 'Профиль',
        content: ProfileSettings,
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
        content: Social,
    },
];

type ISettingsProps = RouteComponentProps<never>;

const Settings = ({ location }: ISettingsProps) => {
    const qs = parseQueryString(location.search);
    return (
        <TabHost
            tabs={tabs}
            defaultSelected={qs.get('tab')}
            saveSelectedInLocation />
    );
}

export default withRouter(Settings);
