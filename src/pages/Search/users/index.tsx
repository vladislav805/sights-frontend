import * as React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import TextInput from '../../../components/TextInput';
import { IPluralForms, parseQueryStringToObject, pluralize, stringifyQueryString } from '../../../utils';
import API from '../../../api';
import useApiFetch from '../../../hook/useApiFetch';
import LoadingSpinner from '../../../components/LoadingSpinner';
import StickyHeader from '../../../components/StickyHeader';
import { SearchUserItem } from './item';
import Button from '../../../components/Button';

type IParams = Partial<{
    query: string;
    cityId?: number;
}>;

const PEER_PAGE = 30;

const fetchFactory = (params: IParams) => () => {
    return API.users.search({
        ...params,
        fields: ['ava', 'rank', 'city'],
        count: PEER_PAGE,
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
                <StickyHeader left={getCountTitle(result.count)}>
                    <div className="search-result">
                        {!loading && result?.items.map(user => (
                            <SearchUserItem key={user.userId} user={user} />
                        ))}
                    </div>
                </StickyHeader>
            )}
        </div>
    );
};
