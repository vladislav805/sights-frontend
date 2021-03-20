import * as React from 'react';
import './style.scss';
import { useHistory, useLocation } from 'react-router-dom';
import { SearchSights } from './sights';
import { SearchCollections } from './collections';
import { SearchUsers } from './users';
import { ITab, TabHost } from '../../components/Tabs';
import { parseQueryStringToObject, stringifyQueryString } from '../../utils/qs';
import { ISearchEntryProps } from './common';
import useOffset from '../../hook/useOffset';
import { objectFilter } from '../../utils/object-utils';

type SearchType = 'sights' | 'collections' | 'users';

type ISearchPageProps = {
    // eslint-disable-next-line react/require-default-props
    searchType?: SearchType;
};

const types: Record<SearchType, React.FC<ISearchEntryProps>> = {
    sights: SearchSights,
    users: SearchUsers,
    collections: SearchCollections,
};

const tabs: ITab[] = [
    {
        name: 'sights',
        title: 'Достопримечательности',
    } as const,
    {
        name: 'collections',
        title: 'Коллекции',
    } as const,
    {
        name: 'users',
        title: 'Пользователи',
    } as const,
];

const SearchPage: React.FC<ISearchPageProps> = ({ searchType = 'sights' }: ISearchPageProps) => {
    const history = useHistory();
    const location = useLocation();
    const offset = useOffset();

    // Объект с параметрами из query string
    const query = React.useMemo(() => {
        const params = parseQueryStringToObject(location.search);

        if (!('offset' in params)) {
            params.offset = '0';
        }

        return params;
    }, [location.search]);

    // Компонент для вывода в зависимости от /search/TYPE
    const ContentChild = React.useMemo(() => types[searchType], [searchType]);

    // При переключении вкладки меняем URL
    const onTabChanged = React.useMemo(() => (tabName: string) => {
        if (searchType !== tabName) {
            history.push(`/search/${tabName}?query=${query.query ?? ''}`);
        }
    }, [searchType, query]);

    // При переходе на другую страницу результатов поиска меняем URL
    const onOffsetChange = React.useMemo(() => (offset: number) => {
        if ((!query.offset && offset > 0) || +query.offset !== offset) {
            history.push(`/search/${searchType}?${stringifyQueryString({ ...query, offset })}`);
        }
    }, [offset, query]);

    // При отправке формы поиска изменяем URL
    const onFormSubmit = React.useMemo(() => (params: Record<string, string>) => {
        history.push(`/search/${searchType}?${stringifyQueryString(objectFilter(params))}`);
    }, [history]);

    return (
        <>
            <TabHost
                defaultSelected={searchType}
                onTabChanged={onTabChanged}
                tabs={tabs}>
                <ContentChild
                    onOffsetChange={onOffsetChange}
                    params={query}
                    offset={offset}
                    onFormSubmit={onFormSubmit} />
            </TabHost>
        </>
    );
};

export default SearchPage;
