import * as React from 'react';
import { TabHost } from '../../../components/Tabs/Host';
import { ITab } from '../../../components/Tabs';

const tabs: ITab[] = [
	{
		name: 'site',
		title: 'Сайт',
		content: <p>site</p>,
	},
	{
		name: 'profile',
		title: 'Профиль',
		content: <p>profile</p>,
	},
];

const Settings = () => (
    <TabHost wide tabs={tabs} />
);

export default Settings;
