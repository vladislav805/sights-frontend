import * as React from 'react';
import { TabHost } from '../../../components/Tabs/Host';
import { ITab } from '../../../components/Tabs';
import ProfileSettings from './profile';
import Preferences from './preferences';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { parseQueryString } from '../../../utils/qs';

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
        name: 'telegram',
        title: 'Telegram',
        content: null,
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
