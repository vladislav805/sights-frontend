import * as React from 'react';
import TextInput from '../../../components/TextInput';
import FakeTextInput from '../../../components/FakeTextInput';
import { ICity } from '../../../api/types/city';
import { ICategory } from '../../../api/types/category';
import CityModal from '../../../components/CityModal';
import * as Modal from '../../../components/Modal';
import CategoryModal from '../../../components/CategoryModal';
import SightFilterForm from '../../../components/SightFilterForm';
import Select, { ISelectOption } from '../../../components/Select';
import { sightAllowedSort, SightSortKey } from '../../../api/types/sight';

type ISightSearchFormParamsProps = {
    formParams: Record<string, string>;
    setFormParams: (params: Record<string, string>) => void;
    city: ICity | null;
    setCity: (city: ICity | null) => void;
    category: ICategory | null;
    setCategory: (category: ICategory) => void;
    filters: string[];
    setFilters: (filters: string[]) => void;
    sort: SightSortKey;
    setSort: (sort: SightSortKey) => void;
};



const selectSortTitles: Record<SightSortKey, string> = {
    rating: 'сначала с высоким рейтингом',
    dateCreated_asc: 'сначала новые',
    dateCreated_desc: 'сначала старые',
    dateUpdated_asc: 'сначала недавно обновлённые',
    dateUpdated_desc: 'сначала давно обновлённые',
};

const selectSortItems: ISelectOption[] = sightAllowedSort.map(value => ({
    value,
    title: selectSortTitles[value],
}));

export const SightSearchFormParams: React.FC<ISightSearchFormParamsProps> = (props: ISightSearchFormParamsProps) => {
    const { formParams, setFormParams, city, setCity, category, setCategory, filters, setFilters, sort, setSort } = props;

    const [showCityModal, setShowCityModal] = React.useState<boolean>(false);
    const [showCategoryModal, setShowCategoryModal] = React.useState<boolean>(false);

    const { onChangeText } = React.useMemo(() => ({
        // При изменении текста меняем именно formParams
        onChangeText: (name: string, value: string) => {
            setFormParams({
                ...formParams,
                [name]: value,
            });
        },
    }), [formParams]);

    const onSortChange = React.useMemo(() => (_: string, value: SightSortKey) => setSort(value), [sort]);

    return (
        <>
            <TextInput
                label="Ключевая фраза"
                name="query"
                value={formParams.query}
                onChange={onChangeText} />
            <FakeTextInput
                label="Город"
                value={city ? city.name : 'не выбран'}
                onClick={() => setShowCityModal(true)} />
            <FakeTextInput
                label="Категория"
                value={category ? category.title : 'не выбрана'}
                onClick={() => setShowCategoryModal(true)} />
            <SightFilterForm
                filterKeys={filters}
                onChangeFilters={setFilters} />
            <Select
                selectedIndex={sightAllowedSort.indexOf(sort)}
                name="sort"
                label="Сортировка"
                items={selectSortItems}
                onSelect={onSortChange} />
            <Modal.Window
                show={showCityModal}
                onOverlayClick={() => setShowCityModal(false)}>
                <CityModal
                    selected={city}
                    onChange={city => {
                        setCity(city);
                        setShowCityModal(false);
                    }} />
            </Modal.Window>
            <Modal.Window
                show={showCategoryModal}
                onOverlayClick={() => setShowCategoryModal(false)}>
                <CategoryModal
                    selected={category}
                    onChange={category => {
                        setCategory(category);
                        setShowCategoryModal(false);
                    }} />
            </Modal.Window>
        </>
    );
};
