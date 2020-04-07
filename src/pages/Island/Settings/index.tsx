import * as React from 'react';
import { TabHost } from '../../../components/Tabs/Host';
import { ITab } from '../../../components/Tabs';
import ProfileSettings from './profile';
import Preferences from './preferences';

const tabs: ITab[] = [
    {
        name: 'site',
        title: 'Сайт',
        content: <Preferences />,
    },
    {
        name: 'profile',
        title: 'Профиль',
        content: <ProfileSettings />,
    },
];

const Settings = () => (
    <TabHost wide tabs={tabs} />
);

export default Settings;
