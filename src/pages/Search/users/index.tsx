import * as React from 'react';
import * as Modal from '../../../components/Modal';
import { apiExecute } from '../../../api';
import { IPluralForms, pluralize } from '../../../utils/pluralize';
import { parseQueryStringToObject, stringifyQueryString } from '../../../utils/qs';
import TextInput from '../../../components/TextInput';
import LoadingSpinner from '../../../components/LoadingSpinner';
import CityModal from '../../../components/CityModal';
import FakeTextInput from '../../../components/FakeTextInput';
import StickyHeader from '../../../components/StickyHeader';
import Button from '../../../components/Button';
import { SearchUserItem } from './item';
import { useHistory, useLocation } from 'react-router-dom';
import useApiFetch from '../../../hook/useApiFetch';
import type { IApiList } from '../../../api/types/api';
import type { ICity } from '../../../api/types/city';
import type { IUser } from '../../../api/types/user';

type IParams = Partial<{
    query: string;
    cityId?: number;
}>;

const PEER_PAGE = 30;

type IResultSearch = {
    search: IApiList<IUser>;
    city: ICity | null;
};

const fetchFactory = (params: IParams, offset: number) => () => {
    return apiExecute<IResultSearch>('const search=API.users.search(A),city=A.cityId?API.cities.getById({cityIds:A.cityId})?.[0]:null;return{search,city};', {
        ...params,
        fields: ['ava', 'rank', 'city'],
        count: PEER_PAGE,
        offset,
    });
};

const foundPlural: IPluralForms = {
    one: 'Найден',
    some: 'Найдено',
    many: 'Найдены',
};

const usersPlural: IPluralForms = {
    one: 'пользователь',
    some: 'пользователя',
    many: 'пользователей',
};

const getCountTitle = (n: number) => `${pluralize(n, foundPlural)} ${n} ${pluralize(n, usersPlural)}`;

export const SearchUsers: React.FC = () => {
    // Строка запроса из адреса
    const queryString = useLocation().search;

    // Парсинг в объект
    const queryParams = React.useMemo(() => parseQueryStringToObject(queryString), [queryString]);

    // Создание функции для запроса по URL
    const fetcher = React.useMemo(() => fetchFactory(queryParams, 0), [queryParams]);

    const [city, setCity] = React.useState<ICity | null>(null);
    const [showCityModal, setShowCityModal] = React.useState<boolean>(false);

    // Использование ответа от API
    const { result, loading } = useApiFetch(fetcher);

    const { search, city: reqCity } = result ?? {};

    React.useEffect(() => {
        setCity(reqCity);
    }, [reqCity]);

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

            history.push(`/search/users?${stringifyQueryString(formParams)}`);
        },
    }), [formParams]);

    return (
        <div className="search search__users">
            <StickyHeader left="Поиск пользователей">
                <form className="search-form" onSubmit={onSubmit}>
                    <TextInput
                        label="Имя, фамилия или @логин"
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
            {!loading && result && (
                <StickyHeader left={getCountTitle(search.count)}>
                    <div className="search-result">
                        {!loading && search?.items.map(user => (
                            <SearchUserItem key={user.userId} user={user} />
                        ))}
                    </div>
                </StickyHeader>
            )}
            <Modal.Window
                show={showCityModal}
                onOverlayClick={() => setShowCityModal(false)}>
                <CityModal
                    selected={city}
                    onChange={city => {
                        setFormParams({ ...formParams, cityId: city ? city.cityId : null });
                        setCity(city);
                        setShowCityModal(false);
                    }} />
            </Modal.Window>
        </div>
    );
};
