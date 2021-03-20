import * as React from 'react';
import useApiFetch from '../../../hook/useApiFetch';
import StickyHeader from '../../../components/StickyHeader';
import Button from '../../../components/Button';
import LoadingSpinner from '../../../components/LoadingSpinner';
import { apiExecute } from '../../../api';
import SightGallery, { SightGalleryView } from '../../../components/SightsGallery';
import InfoSplash from '../../../components/InfoSplash';
import { ISearchEntryProps } from '../common';
import { IApiList } from '../../../api/types/api';
import { ISight, SightSortKey } from '../../../api/types/sight';
import { ICity } from '../../../api/types/city';
import { ICategory } from '../../../api/types/category';
import { SightSearchFormParams } from './form-params';

type IParams = Partial<{
    query: string;
    cityId?: string;
    categoryId?: string;
    filters?: string;
    sort?: string,
}>;

const PEER_PAGE = 20;

type IResultSearch = {
    search: IApiList<ISight>;
    city: ICity | null;
    category: ICategory | null;
};

const fetchFactory = (params: IParams, offset: number) =>
    () =>
        apiExecute<IResultSearch>('const search=API.sights.search(A),city=A.cityId?API.cities.getById({cityIds:A.cityId})?.[0]:null,'
            + 'category=A.categoryId?API.categories.getById({categoryIds:A.categoryId})?.[0]:null;return{search,city,category};', {
            query: params.query,
            cityId: +params.cityId,
            categoryId: +params.categoryId,
            filters: params.filters,
            fields: ['photo', 'author', 'city', 'rating', 'visitState'],
            count: PEER_PAGE,
            sort: params.sort,
            offset,
        });

export const SearchSights: React.FC<ISearchEntryProps> = ({ params, offset, onFormSubmit, onOffsetChange }: ISearchEntryProps) => {
    // Парсинг в объект
    const queryParams = params;

    // Создание функции для запроса по URL
    const fetcher = React.useMemo(() => fetchFactory(queryParams, offset), [queryParams, offset]);
    const [city, setCity] = React.useState<ICity | null>(null);
    const [category, setCategory] = React.useState<ICategory | null>(null);
    const [filters, setFilters] = React.useState<string[]>(queryParams.filters?.split(',') ?? []);
    const [sort, setSort] = React.useState<SightSortKey>(queryParams.sort as SightSortKey ?? 'dateCreated_asc');

    // Использование ответа от API
    const { result, error, loading } = useApiFetch(fetcher);

    const { search, city: reqCity, category: reqCategory } = result ?? {};

    React.useEffect(() => {
        setCity(reqCity);
        setCategory(reqCategory);
    }, [reqCity, reqCategory]);

    // Объект с данными из текстовых полей формы
    const [formParams, setFormParams] = React.useState<IParams>(queryParams);

    const { onSubmit } = React.useMemo(() => ({
        // При отправке формы меняем урл, тем самым делая другим queryString и дёргая запрос
        onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            onFormSubmit({
                ...formParams,
                filters: filters.join(','),
                cityId: city ? String(city.cityId) : null,
                categoryId: category ? String(category.categoryId) : null,
                sort,
            });
        },
    }), [formParams, sort, city, category]);

    return (
        <div className="search search__sights">
            <StickyHeader left="Поиск достопримечательностей">
                <form className="search-form" onSubmit={onSubmit}>
                    <SightSearchFormParams
                        formParams={formParams}
                        setFormParams={setFormParams}
                        city={city}
                        setCity={setCity}
                        category={category}
                        setCategory={setCategory}
                        filters={filters}
                        setFilters={setFilters}
                        sort={sort}
                        setSort={setSort} />
                    <Button
                        type="submit"
                        label="Поиск"
                        loading={loading} />
                </form>
            </StickyHeader>
            {loading && (
                <LoadingSpinner block />
            )}
            {error && (
                <InfoSplash description="Введите поисковый запрос" />
            )}
            {!error && !loading && search && (
                <SightGallery
                    defaultView={SightGalleryView.LIST}
                    offset={offset}
                    count={search.count}
                    items={search.items}
                    peerPage={PEER_PAGE}
                    onOffsetChange={onOffsetChange} />
            )}
        </div>
    );
};
