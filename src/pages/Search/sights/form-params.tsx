import * as React from 'react';
import TextInput from '../../../components/TextInput';
import FakeTextInput from '../../../components/FakeTextInput';
import { ICity } from '../../../api/types/city';
import { ICategory } from '../../../api/types/category';
import CityModal from '../../../components/CityModal';
import * as Modal from '../../../components/Modal';
import CategoryModal from '../../../components/CategoryModal';
import SightFilterForm from '../../../components/SightFilterForm';

type ISightSearchFormParamsProps = {
    formParams: Record<string, string>;
    setFormParams: (params: Record<string, string>) => void;
    city: ICity | null;
    setCity: (city: ICity | null) => void;
    category: ICategory | null;
    setCategory: (category: ICategory) => void;
    filters: string[];
    setFilters: (filters: string[]) => void;
};


export const SightSearchFormParams: React.FC<ISightSearchFormParamsProps> = (props: ISightSearchFormParamsProps) => {
    const { formParams, setFormParams, city, setCity, category, setCategory, filters, setFilters } = props;

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
            <Modal.Window
                show={showCategoryModal}
                onOverlayClick={() => setShowCategoryModal(false)}>
                <CategoryModal
                    selected={category}
                    onChange={category => {
                        setFormParams({ ...formParams, categoryId: category ? String(category.categoryId) : null });
                        setCategory(category);
                        setShowCategoryModal(false);
                    }} />
            </Modal.Window>
        </>
    );
};
