import { ISight } from '../../api/types/sight';

type SightListFilterFactory<T> = (value: T) => SightListFilter;

// Фильтр, который применяется с серверной стороны (добавляется параметр
// в запрос и прилетает список уже с применённым фильтром)
export type SightListFilterRemote = { type: 'remote', value: string };

// Фильтр, который применяется на клиенте с уже полученными данными
export type SightListFilterClient = { type: 'client', filter: SightListFilterFunction };

// Функция, получающая на вход объект достопримечательности, должна "решить"
// выводить её или нет (true/false)
export type SightListFilterFunction = (sight: ISight) => boolean;

// Общий тип фильтра
export type SightListFilter = SightListFilterRemote | SightListFilterClient;

// Тип, позволяющий получить значения по всем свойствам из указанного типа
export type ValuesOf<T> = T[keyof T];

export const UNSET = '';

// Имеется ли подтверждение (не указано, да, нет)
export const Verified = {
    UNSET,
    VERIFIED: 'verified',
    NOT_VERIFIED: '!verified',
};

// Посещено ли пользователем (без разницы, только посещено, только
// не посещено, только желаемое)
export const Visited = {
    UNSET,
    VISITED: 'visited',
    NOT_VISITED: '!visited',
    DESIRED: 'desired',
};

// Имеется ли у достопримечательности фотография (без разницы, да, нет)
export const Photo = {
    UNSET,
    EXISTS: 'photo',
    NOT_EXISTS: '!photo',
};

// Является ли достопримечательность архивной (уже не существующей/утерянной)
// (без разницы, да, нет)
export const Archived = {
    UNSET,
    ARCHIVED: 'archived',
    NOT_ARCHIVED: '!archived',
};

// Получение ключа (на самом деле, того же значения, что и value), если в объекте dict
// есть значение value, иначе возврат пустой строки (unset)
export const getConstByValue = <T extends Record<string, string>>(dict: T, values: string[]): string => {
    for (const value of values) {
        const keys = Object.keys(dict);
        for (const key of keys) {
            if (key && value === dict[key]) {
                return value;
            }
        }
    }
    return UNSET;
};

export type SightFilterRecord = {
    verified: ValuesOf<typeof Verified>;
    visited: ValuesOf<typeof Visited>;
    photo: ValuesOf<typeof Photo>;
    archived: ValuesOf<typeof Archived>;
};

export const createVerifiedFilter: SightListFilterFactory<ValuesOf<typeof Verified>> = value => ({ type: 'remote', value });
export const createVisitedFilter: SightListFilterFactory<ValuesOf<typeof Visited>> = value => ({ type: 'remote', value });
export const createPhotoFilter: SightListFilterFactory<ValuesOf<typeof Photo>> = value => ({ type: 'remote', value });
export const createArchivedFilter: SightListFilterFactory<ValuesOf<typeof Archived>> = value => ({ type: 'remote', value });
