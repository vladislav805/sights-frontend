import * as React from 'react';
import './style.scss';
import { SearchSights } from './sights';
import { SearchCollections } from './collections';
import { SearchUsers } from './users';
import { TabHost } from '../../components/Tabs';

type SearchType = 'sights' | 'collections' | 'users';

type ISearchPageProps = {
    searchType: SearchType;
};

const SearchPage: React.FC<ISearchPageProps> = (props: ISearchPageProps) => (
    <TabHost
        defaultSelected={props.searchType}
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

SearchPage.defaultProps = {
    searchType: 'sights',
};

export default SearchPage;
