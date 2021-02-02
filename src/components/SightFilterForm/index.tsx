import Select, { ISelectOption, SelectOnSelect } from '../Select';
import {
    Archived,
    createArchivedFilter,
    createPhotoFilter,
    createVerifiedFilter,
    createVisitedFilter, getConstByValue,
    Photo,
    SightFilterRecord,
    SightListFilter,
    UNSET,
    Verified,
    Visited,
} from './filters';
import * as React from 'react';
import useCurrentUser from '../../hook/useCurrentUser';

const verifiedItems: ISelectOption[] = [
    { value: UNSET, title: 'не имеет значения' },
    { value: Verified.VERIFIED, title: 'только подтверждённые' },
    { value: Verified.NOT_VERIFIED, title: 'только неподтверждённые' },
];

const visitedItems: ISelectOption[] = [
    { value: UNSET, title: 'не имеет значения' },
    { value: Visited.DESIRED, title: 'только желаемые' },
    { value: Visited.VISITED, title: 'только посещённые' },
    { value: Visited.NOT_VISITED, title: 'только не посещенные' },
];

const photoItems: ISelectOption[] = [
    { value: UNSET, title: 'не имеет значения' },
    { value: Photo.EXISTS, title: 'только с фотографиями' },
    { value: Photo.NOT_EXISTS, title: 'только без фотографий' },
];

const archivedItems: ISelectOption[] = [
    { value: UNSET, title: 'показывать все' },
    { value: Archived.ARCHIVED, title: 'показывать только утраченные' },
    { value: Archived.NOT_ARCHIVED, title: 'скрыть утраченные' },
];

type ISightFilterFormProps = {
    onChangeFilters: (filterKeys: string[], filters: SightListFilter[]) => void;
    filterKeys?: string[];
};

const SightFilterForm: React.FC<ISightFilterFormProps> = (props: ISightFilterFormProps) => {
    const [filters, setFilters] = React.useState<SightFilterRecord>({
        verified: getConstByValue(Verified, props.filterKeys),
        visited: getConstByValue(Visited, props.filterKeys),
        photo: getConstByValue(Photo, props.filterKeys),
        archived: getConstByValue(Archived, props.filterKeys),
    });

    const currentUser = useCurrentUser();

    React.useEffect(() => {
        const result: SightListFilter[] = [
            filters.verified !== UNSET && createVerifiedFilter(filters.verified),
            filters.visited !== UNSET && createVisitedFilter(filters.visited),
            filters.photo !== UNSET && createPhotoFilter(filters.photo),
            filters.archived !== UNSET && createArchivedFilter(filters.archived),
        ].filter(Boolean);

        props.onChangeFilters(Object.values(filters).filter(Boolean), result);
    }, [filters]);

    const onSelect: SelectOnSelect = (name: keyof SightFilterRecord, value: string) => {
        const newFilters = {
            ...filters,
            [name]: value,
        };

        if (!value) {
            newFilters[name] = UNSET;
        }

        setFilters(newFilters);
    };

    return (
        <>
            <Select
                selectedIndex={verifiedItems.findIndex(item => item.value === filters.verified)}
                label="Статус подтверждения"
                name="verified"
                items={verifiedItems}
                onSelect={onSelect} />

            {currentUser && (
                <Select
                    selectedIndex={visitedItems.findIndex(item => item.value === filters.visited)}
                    label="Статус посещения"
                    name="visited"
                    items={visitedItems}
                    onSelect={onSelect} />
            )}

            <Select
                selectedIndex={photoItems.findIndex(item => item.value === filters.photo)}
                label="Наличие фотографий"
                name="photo"
                items={photoItems}
                onSelect={onSelect} />

            <Select
                selectedIndex={archivedItems.findIndex(item => item.value === filters.archived)}
                label="Уже не существующие"
                name="archived"
                items={archivedItems}
                onSelect={onSelect} />
        </>
    );
};

SightFilterForm.defaultProps = {
    filterKeys: [],
};

export default SightFilterForm;
