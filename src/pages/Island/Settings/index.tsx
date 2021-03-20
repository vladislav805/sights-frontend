import * as React from 'react';
import { useLocation } from 'react-router-dom';
import { ITab, TabHost } from '../../../components/Tabs';
import { parseQueryString } from '../../../utils/qs';
import Preferences from './preferences';
import ProfileSettings from './profile';
import Social from './social';
import Photo from './photo';
import useCurrentUser from '../../../hook/useCurrentUser';

const tabContents = {
    site: Preferences,
    profile: ProfileSettings,
    photo: Photo,
    social: Social,
};

type TabType = keyof typeof tabContents;

const tabs: ITab[] = [
    {
        name: 'site',
        title: 'Сайт',
    },
    {
        name: 'profile',
        title: 'Профиль',
    },
    {
        name: 'photo',
        title: 'Фото',
    },
    {
        name: 'password',
        title: 'Пароль',
    },
    {
        name: 'notifications',
        title: 'Уведомления',
    },
    {
        name: 'social',
        title: 'Вход',
    },
];

const onlyAuthorized = ['profile', 'photo', 'password', 'notifications', 'social'];

const Settings: React.FC = () => {
    const location = useLocation();
    const qs = parseQueryString(location.search);
    const [tab, setTab] = React.useState<string>('site');
    const user = useCurrentUser();

    const tabsList = React.useMemo(() => {
        let list = tabs.slice(0);
        if (!user) {
            list = list.filter(tab => !onlyAuthorized.includes(tab.name));
        }
        return list;
    }, []);

    const TabContent = tabContents[tab as TabType] ?? (() => null) as React.FC;

    return (
        <TabHost
            tabs={tabsList}
            defaultSelected={qs.get('tab')}
            onTabChanged={setTab}
            saveSelectedInLocation>
            <TabContent />
        </TabHost>
    );
};

export default Settings;
