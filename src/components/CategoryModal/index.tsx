import * as React from 'react';
import './style.scss';
import * as Modal from '../Modal';
import classNames from 'classnames';
import API, { IApiList } from '../../api/';
import TextInput, { TextInputType } from '../TextInput';
import { ICategory } from '../../api/types/category';
import withSpinnerWrapper from '../LoadingSpinner/wrapper';
import LoadingSpinner from '../LoadingSpinner';

type ICategoryModalProps = {
    onChange(city: ICategory): void;
    selected?: ICategory | number;
};

let cache: IApiList<ICategory>;
const getCategories = async(): Promise<IApiList<ICategory>> => cache
    ? Promise.resolve(cache)
    : API.categories.get();

const CategoryModal: React.FC<ICategoryModalProps> = (props: ICategoryModalProps) => {
    const [query, setQuery] = React.useState<string>('');
    const [items, setItems] = React.useState<ICategory[]>(null);

    const onChangeQuery = (name: string, value: string) => setQuery(value);

    React.useEffect(() => {
        void getCategories().then(res => setItems(res.items));
    }, []);

    const selectedId: number | undefined = props.selected
        ? (typeof props.selected === 'number'
            ? props.selected
            : props.selected.categoryId
        ) : undefined;

    return (
        <>
            <Modal.Title>Выбор категории</Modal.Title>
            <Modal.Content>
                <div
                    className="categoryModal">
                    <div className="categoryModal-items">
                        {!items && withSpinnerWrapper(<LoadingSpinner size="m" />)}
                        {items && items.map(category => (
                            <div
                                key={category.categoryId}
                                className={classNames(
                                    'categoryModal-item',
                                    selectedId === category.categoryId && 'categoryModal-item__selected'
                                )}
                                onClick={() => props.onChange(category)}>
                                {category.title}
                            </div>
                        ))}
                    </div>
                </div>
            </Modal.Content>
            <Modal.Footer>
                <TextInput
                    type={TextInputType.text}
                    value={query}
                    label="Быстрый поиск"
                    onChange={onChangeQuery} />
            </Modal.Footer>
        </>
    );
};

export default CategoryModal;
