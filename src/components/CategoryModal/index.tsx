import * as React from 'react';
import * as Modal from '../Modal';
import API from '../../api';
import { ICategory } from '../../api/types/category';
import { IApiList } from '../../api/types/api';
import LiveList, { ILiveListItem } from '../LiveList';
import Button from '../Button';

type ICategoryModalProps = {
    onChange(city: ICategory): void;
    selected?: ICategory;
};

let cache: IApiList<ICategory>;
const getCategories = async(): Promise<IApiList<ICategory>> => cache
    ? Promise.resolve(cache)
    : API.categories.get();

const convert2listItem = (category: ICategory, selected: number): ILiveListItem<ICategory> => ({
    id: category.categoryId,
    title: category.title,
    selected: category.categoryId === selected,
    object: category,
});

const CategoryModal: React.FC<ICategoryModalProps> = (props: ICategoryModalProps) => {
    const { onOpen, onTyping, onReset } = React.useMemo(() => ({
        onOpen: () =>
            getCategories()
                .then(res => res.items.map(item => convert2listItem(item, props.selected?.categoryId))),

        onTyping: (query: string) =>
            getCategories()
                .then(res => res.items.filter(category => category.title.toLowerCase().includes(query)))
                .then(res => res.sort((a, b) => a.title.indexOf(query) - b.title.indexOf(query)))
                .then(res => res.map(item => convert2listItem(item, props.selected?.categoryId))),

        onReset: () =>
            props.onChange(null),
    }), []);

    return (
        <>
            <Modal.Title>Выбор категории</Modal.Title>
            <Modal.Content>
                <LiveList
                    onOpen={onOpen}
                    needSearch
                    onTyping={onTyping}
                    onSelect={(category: ILiveListItem<ICategory>) => props.onChange(category.object)} />
            </Modal.Content>
            <Modal.Footer>
                <Button
                    label="Сброс"
                    onClick={onReset} />
            </Modal.Footer>
        </>
    );
};

export default CategoryModal;
