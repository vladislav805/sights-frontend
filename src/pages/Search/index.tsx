import * as React from 'react';
import './style.scss';
import { SearchSights } from './sights';
import { SearchCollections } from './collections';
import { SearchUsers } from './users';
import { ITab, TabHost } from '../../components/Tabs';
import { replaceUrl } from './common';

type SearchType = 'sights' | 'collections' | 'users';

type ISearchPageProps = {
    searchType: SearchType;
};

const onTabChanged = (tab: ITab) => {
    replaceUrl(`/search/${tab.name}`);
};

const SearchPage: React.FC<ISearchPageProps> = (props: ISearchPageProps) => {
    return (
        <TabHost
            defaultSelected={props.searchType}
            onTabChanged={onTabChanged}
            tabs={[
                {
                    name: 'sights',
                    title: 'Достопримечательности',
                    content: <SearchSights />,
                },
                {
                    name: 'collections',
                    title: 'Коллекции',
                    content: <SearchCollections />,
                },
                {
                    name: 'users',
                    title: 'Пользователи',
                    content: <SearchUsers />,
                },
            ]} />
    );
};

SearchPage.defaultProps = {
    searchType: 'sights',
};

export default SearchPage;
