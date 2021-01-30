import * as React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { parseQueryStringToObject, stringifyQueryString } from '../../../utils';
import useApiFetch from '../../../hook/useApiFetch';
import StickyHeader from '../../../components/StickyHeader';
import TextInput from '../../../components/TextInput';
import Button from '../../../components/Button';
import LoadingSpinner from '../../../components/LoadingSpinner';
import API from '../../../api';
import CollectionGallery from '../../../components/CollectionGallery';

type IParams = Partial<{
    query: string;
    cityId?: number;
}>;

const PEER_PAGE = 20;

const fetchFactory = (params: IParams) => () => {
    return API.collections.search({
        query: params.query,
        cityId: params.cityId,
        fields: ['collection_city', 'collection_rating'],
        count: PEER_PAGE,
    });
};

export const SearchCollections: React.FC = () => {
    // Строка запроса из адреса
    const queryString = useLocation().search;

    // Парсинг в объект
    const queryParams = React.useMemo(() => parseQueryStringToObject(queryString), [queryString]);

    // Создание функции для запроса по URL
    const fetcher = React.useMemo(() => fetchFactory(queryParams), [queryParams]);

    // Использование ответа от API
    const { result, loading } = useApiFetch(fetcher);

    // Объект с данными из текстовых полей формы
    const [formParams, setFormParams] = React.useState<IParams>(queryParams);

    // Использование истории для замены URL
    const history = useHistory();

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

            history.push(`/search/collections?${stringifyQueryString(formParams)}`);
        },
    }), [formParams]);

    return (
        <div className="search search__collections">
            <StickyHeader left="Поиск коллекций">
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
            {!loading && result && (
                <CollectionGallery
                    requestCollections={void 0}
                    count={result.count}
                    items={result.items} />
            )}
        </div>
    );
};
