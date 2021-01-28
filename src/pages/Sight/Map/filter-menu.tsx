import * as React from 'react';
import './style.scss';
import classNames from 'classnames';
import Select, { ISelectOption, SelectOnSelect } from '../../../components/Select';
import {
    Archived,
    createArchivedFilter,
    createPhotoFilter,
    createVerifiedFilter,
    createVisitedFilter,
    Photo,
    SightListFilter,
    UNSET,
    ValuesOf,
    Verified,
    Visited,
} from './filters';
import useCurrentUser from '../../../hook/useCurrentUser';

type IMapFiltersProps = {
    onChangeFilters: (filters: SightListFilter[]) => void;
};

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

type FilterRecord = {
    verified: ValuesOf<typeof Verified>;
    visited: ValuesOf<typeof Visited>;
    photo: ValuesOf<typeof Photo>;
    archived: ValuesOf<typeof Archived>;
};

const MapFilters: React.FC<IMapFiltersProps> = (props: IMapFiltersProps) => {
    const [visible, setVisible] = React.useState<boolean>(false);
    const [filters, setFilters] = React.useState<FilterRecord>({
        verified: Verified.UNSET,
        visited: Visited.UNSET,
        photo: Photo.UNSET,
        archived: Archived.NOT_ARCHIVED,
    });

    const currentUser = useCurrentUser();

    React.useEffect(() => {
        const result: SightListFilter[] = [
            filters.verified !== UNSET && createVerifiedFilter(filters.verified),
            filters.visited !== UNSET && createVisitedFilter(filters.visited),
            filters.photo !== UNSET && createPhotoFilter(filters.photo),
            filters.archived !== UNSET && createArchivedFilter(filters.archived),
        ].filter(Boolean);

        props.onChangeFilters(result);
    }, [filters]);

    const onSelect: SelectOnSelect = (name: keyof FilterRecord, value: string) => {
        const newFilters = {
            ...filters,
            [name]: value,
        };

        if (!value) {
            newFilters[name] = UNSET;
        }

        setFilters(newFilters);
    };

    const toggleVisible = React.useMemo(() => () => setVisible(!visible), [visible]);

    return (
        <div
            className={classNames('mapFilters', visible && 'mapFilters__visible')}>
            <div
                className="mapFilters-puller"
                onClick={toggleVisible}>
                Фильтры
            </div>
            <div
                className="mapFilters-content">
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
            </div>
        </div>
    );
};

export default MapFilters;
