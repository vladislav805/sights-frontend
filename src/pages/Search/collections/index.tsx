import * as React from 'react';
import useApiFetch from '../../../hook/useApiFetch';
import StickyHeader from '../../../components/StickyHeader';
import TextInput from '../../../components/TextInput';
import Button from '../../../components/Button';
import LoadingSpinner from '../../../components/LoadingSpinner';
import { apiExecute } from '../../../api';
import CollectionGallery from '../../../components/CollectionGallery';
import { ISearchEntryProps } from '../common';
import { IApiList } from '../../../api/types/api';
import { ICity } from '../../../api/types/city';
import { ICollection } from '../../../api/types/collection';
import FakeTextInput from '../../../components/FakeTextInput';
import CityModal from '../../../components/CityModal';
import * as Modal from '../../../components/Modal';

type IParams = Partial<{
    query: string;
    cityId?: string;
}>;

const PEER_PAGE = 20;

type IResultSearch = {
    search: IApiList<ICollection>;
    city: ICity | null;
};

const fetchFactory = (params: IParams, offset: number) =>
    () =>
        apiExecute<IResultSearch>('const search=API.collections.search(A),'
            + 'city=A.cityId?API.cities.getById({cityIds:A.cityId})?.[0]:null;return{search,city};', {
            query: params.query,
            cityId: +params.cityId,
            fields: ['collection_city', 'collection_rating'],
            count: PEER_PAGE,
            offset,
        });

export const SearchCollections: React.FC<ISearchEntryProps> = ({ params, offset, onOffsetChange, onFormSubmit }: ISearchEntryProps) => {
    // Создание функции для запроса по URL
    const fetcher = React.useMemo(() => fetchFactory(params, offset), [params]);

    const [city, setCity] = React.useState<ICity | null>(null);
    const [showCityModal, setShowCityModal] = React.useState<boolean>(false);

    // Использование ответа от API
    const { result, loading } = useApiFetch(fetcher);

    const { search, city: reqCity } = result ?? {};

    React.useEffect(() => {
        setCity(reqCity);
    }, [reqCity]);

    // Объект с данными из текстовых полей формы
    const [formParams, setFormParams] = React.useState<IParams>(params);

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

            onFormSubmit(formParams);
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
                    <FakeTextInput
                        label="Город"
                        value={city ? city.name : 'не выбран'}
                        onClick={() => setShowCityModal(true)} />
                    <Button
                        type="submit"
                        label="Поиск"
                        loading={loading} />
                </form>
            </StickyHeader>
            {loading && (
                <LoadingSpinner block />
            )}
            {!loading && search && (
                <CollectionGallery
                    count={search.count}
                    items={search.items}
                    peerPage={PEER_PAGE}
                    offset={offset}
                    onOffsetChange={onOffsetChange} />
            )}
            <Modal.Window
                show={showCityModal}
                onOverlayClick={() => setShowCityModal(false)}>
                <CityModal
                    selected={city}
                    onChange={city => {
                        setFormParams({ ...formParams, cityId: city ? String(city.cityId) : null });
                        setCity(city);
                        setShowCityModal(false);
                    }} />
            </Modal.Window>
        </div>
    );
};
