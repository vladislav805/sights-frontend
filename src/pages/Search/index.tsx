import * as React from 'react';
import './style.scss';
import { SearchSights } from './sights';
import { SearchCollections } from './collections';
import { SearchUsers } from './users';
import { ITab, TabHost } from '../../components/Tabs';
import { useHistory, useLocation } from 'react-router-dom';
import { parseQueryStringToObject } from '../../utils';

type SearchType = 'sights' | 'collections' | 'users';

type ISearchPageProps = {
    searchType: SearchType;
};

const types: Record<SearchType, React.FC> = {
    sights: SearchSights,
    users: SearchUsers,
    collections: SearchCollections,
};

const tabs: ITab[] = [
    {
        name: 'sights',
        title: 'Достопримечательности',
        content: null,
    } as const,
    {
        name: 'collections',
        title: 'Коллекции',
        content: null,
    } as const,
    {
        name: 'users',
        title: 'Пользователи',
        content: null,
    } as const,
];

const SearchPage: React.FC<ISearchPageProps> = (props: ISearchPageProps) => {
    const history = useHistory();
    const location = useLocation();
    const query = React.useMemo(() => parseQueryStringToObject(location.search), [location.search]);

    const ContentChild = React.useMemo(() => {
        return types[props.searchType];
    }, [props.searchType]);

    const onTabChanged = React.useMemo(() => {
        return (tab: ITab) => history.push(`/search/${tab.name}?query=${query.query ?? ''}`);
    }, [props.searchType, query]);

    return (
        <>
            <TabHost
                defaultSelected={props.searchType}
                onTabChanged={onTabChanged}
                tabs={tabs} />
            <ContentChild />
        </>
    );
};

SearchPage.defaultProps = {
    searchType: 'sights',
};

export default SearchPage;
