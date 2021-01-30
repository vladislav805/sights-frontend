import * as React from 'react';
import useApiFetch from '../../../hook/useApiFetch';
import StickyHeader from '../../../components/StickyHeader';
import TextInput from '../../../components/TextInput';
import Button from '../../../components/Button';
import LoadingSpinner from '../../../components/LoadingSpinner';
import API from '../../../api';
import CollectionGallery from '../../../components/CollectionGallery';
import { ISearchEntryProps } from '../common';

type IParams = Partial<{
    query: string;
    cityId?: string;
}>;

const PEER_PAGE = 20;

const fetchFactory = (params: IParams, offset: number) => () => {
    return API.collections.search({
        query: params.query,
        cityId: +params.cityId,
        fields: ['collection_city', 'collection_rating'],
        count: PEER_PAGE,
        offset,
    });
};

export const SearchCollections: React.FC<ISearchEntryProps> = (props: ISearchEntryProps) => {
    // Создание функции для запроса по URL
    const fetcher = React.useMemo(() => fetchFactory(props.params, props.offset), [props.params]);

    // Использование ответа от API
    const { result, loading } = useApiFetch(fetcher);

    // Объект с данными из текстовых полей формы
    const [formParams, setFormParams] = React.useState<IParams>(props.params);

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
                    count={result.count}
                    items={result.items}
                    peerPage={PEER_PAGE}
                    offset={props.offset}
                    onOffsetChange={props.onOffsetChange}/>
            )}
        </div>
    );
};
