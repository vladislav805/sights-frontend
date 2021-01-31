import * as React from 'react';
import './style.scss';
import { SearchSights } from './sights';
import { SearchCollections } from './collections';
import { SearchUsers } from './users';
import { ITab, TabHost } from '../../components/Tabs';
import { useHistory, useLocation } from 'react-router-dom';
import { parseQueryStringToObject, stringifyQueryString } from '../../utils';
import { ISearchEntryProps } from './common';
import useOffset from '../../hook/useOffset';

type SearchType = 'sights' | 'collections' | 'users';

type ISearchPageProps = {
    searchType: SearchType;
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

const SearchPage: React.FC<ISearchPageProps> = (props: ISearchPageProps) => {
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
    const ContentChild = React.useMemo(() => types[props.searchType], [props.searchType]);

    // При переключении вкладки меняем URL
    const onTabChanged = React.useMemo(() => (tabName: string) => {
        if (props.searchType !== tabName) {
            history.push(`/search/${tabName}?query=${query.query ?? ''}`);
        }
    }, [props.searchType, query]);

    // При переходе на другую страницу результатов поиска меняем URL
    const onOffsetChange = React.useMemo(() => {
        return (offset: number) => {
            if (!query.offset && offset > 0 || +query.offset !== offset) {
                history.push(`/search/${props.searchType}?${stringifyQueryString({ ...query, offset })}`);
            }
        };
    }, [offset]);

    // При отправке формы поиска изменяем URL
    const onFormSubmit = React.useMemo(() => (params: Record<string, string>) => {
        history.push(`/search/${props.searchType}?${stringifyQueryString(params)}`);
    }, [history]);

    return (
        <>
            <TabHost
                defaultSelected={props.searchType}
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

SearchPage.defaultProps = {
    searchType: 'sights',
};

export default SearchPage;
