import * as React from 'react';
import * as Modal from '../Modal';
import API from '../../api/';
import type { ICity } from '../../api/types/city';
import LiveList, { ILiveListItem } from '../LiveList';
import Button from '../Button';

type ICityModalProps = {
    onChange(city: ICity): void;
    selected?: ICity;
};

const cache = new Map<string, ICity[]>();
const search = async(query: string): Promise<ICity[]> => cache.has(query)
    ? cache.get(query)
    : API.cities.search({ query, count: 8, extended: true });

const convert2listItem = (city: ICity, selected: number): ILiveListItem<ICity> => ({
    id: city.cityId,
    title: city.name + (city.parent ? ` (${city.parent.name})` : ''),
    selected: city.cityId === selected,
    object: city,
});

const CityModal: React.FC<ICityModalProps> = (props: ICityModalProps) => {
    const { onOpen, onTyping, onReset } = React.useMemo(() => ({
        onOpen: () =>
            API.cities.get({ count: 20, extended: true })
                .then(res => res.items.map(item => convert2listItem(item, props.selected?.cityId))),

        onTyping: (query: string) =>
            search(query)
                .then(res => res.map(item => convert2listItem(item, props.selected?.cityId))),

        onReset: () =>
            props.onChange(null),
    }), []);

    return (
        <>
            <Modal.Title>Выбор города</Modal.Title>
            <Modal.Content>
                <LiveList
                    onOpen={onOpen}
                    needSearch
                    onTyping={onTyping}
                    onSelect={(city: ILiveListItem<ICity>) => props.onChange(city.object)} />
            </Modal.Content>
            <Modal.Footer>
                <Button
                    label="Сбросить"
                    onClick={onReset} />
            </Modal.Footer>
        </>
    );
};

export default CityModal;
