import * as React from 'react';
import useApiFetch from '../../../hook/useApiFetch';
import StickyHeader from '../../../components/StickyHeader';
import TextInput from '../../../components/TextInput';
import Button from '../../../components/Button';
import LoadingSpinner from '../../../components/LoadingSpinner';
import API from '../../../api';
import SightGallery, { SightsGalleryView } from '../../../components/SightsGallery';
import InfoSplash from '../../../components/InfoSplash';
import { ISearchEntryProps } from '../common';

type IParams = Partial<{
    query: string;
    cityId?: string;
    categoryId?: string;
    filters?: string;
}>;

const PEER_PAGE = 20;

const fetchFactory = (params: IParams, offset: number) => () => {
    return API.sights.search({
        query: params.query,
        cityId: +params.cityId,
        categoryId: +params.categoryId,
        filters: params.filters,
        fields: ['photo', 'author', 'city', 'rating'],
        count: PEER_PAGE,
        offset,
    });
};

type ISearchSightsProps = ISearchEntryProps;

export const SearchSights: React.FC<ISearchSightsProps> = (props: ISearchSightsProps) => {
    // Парсинг в объект
    const queryParams = props.params;

    // Создание функции для запроса по URL
    const fetcher = React.useMemo(() => fetchFactory(queryParams, props.offset), [props.offset]);

    // Использование ответа от API
    const { result, error, loading } = useApiFetch(fetcher);

    // Объект с данными из текстовых полей формы
    const [formParams, setFormParams] = React.useState<IParams>(queryParams);

    const { onChangeText, onSubmit } = React.useMemo(() => ({
        // При изменении текста меняем именно formParams
        onChangeText: (name: string, value: string) => {
            setFormParams({
                ...formParams,
                [name]: value,
            });
        },

        // При отправке формы меняем урл, тем самым делая другим queryString и дёргая запрос
        onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            props.onFormSubmit(formParams);
        },
    }), [formParams]);

    return (
        <div className="search search__sights">
            <StickyHeader left="Поиск достопримечательностей">
                <form className="search-form" onSubmit={onSubmit}>
                    <TextInput
                        label="Ключевая фраза"
                        name="query"
                        value={formParams.query}
                        onChange={onChangeText} />
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
            {!error && !loading && result && (
                <SightGallery
                    defaultView={SightsGalleryView.LIST}
                    offset={props.offset}
                    count={result.count}
                    items={result.items}
                    peerPage={PEER_PAGE}
                    onOffsetChange={props.onOffsetChange} />
            )}
        </div>
    );
};
