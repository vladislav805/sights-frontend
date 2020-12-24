import * as React from 'react';
import './style.scss';
import * as Modal from '../Modal';
import classNames from 'classnames';
import API from '../../api/';
import TextInput from '../TextInput';
import { ICity } from '../../api';
import withSpinnerWrapper from '../LoadingSpinner/wrapper';
import LoadingSpinner from '../LoadingSpinner';

type ICityModalProps = {
    onChange(city: ICity): void;
    selected?: ICity | number;
};

const cache = new Map<string, ICity[]>();
const search = async(query: string): Promise<ICity[]> => cache.has(query)
    ? cache.get(query)
    : API.cities.search({ query, count: 8, extended: true });

const CityModal: React.FC<ICityModalProps> = (props: ICityModalProps) => {
    const [query, setQuery] = React.useState<string>('');
    const [items, setItems] = React.useState<ICity[]>(null);

    const onChangeQuery = (name: string, value: string) => setQuery(value);

    React.useEffect(() => {
        void API.cities.get({ count: 20, extended: true }).then(res => setItems(res.items));
    }, []);

    React.useEffect(() => {
        void search(query.toLowerCase()).then(setItems);
    }, [query]);

    const selectedId: number | undefined = props.selected
        ? (typeof props.selected === 'number'
            ? props.selected
            : props.selected.cityId
        ) : undefined;

    return (
        <>
            <Modal.Title>Выбор города</Modal.Title>
            <Modal.Content>
                <div
                    className="cityModal">
                    <div className="cityModal-items">
                        {!items && withSpinnerWrapper(<LoadingSpinner size="m" />)}
                        {items && items.map(city => (
                            <div
                                key={city.cityId}
                                className={classNames(
                                    'cityModal-item',
                                    selectedId === city.cityId && 'cityModal-item__selected'
                                )}
                                onClick={() => props.onChange(city)}>
                                {city.name}
                                {city.parent && (
                                    ` (${city.parent.name})`
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </Modal.Content>
            <Modal.Footer>
                <TextInput
                    type="text"
                    name="query"
                    value={query}
                    label="Быстрый поиск"
                    onChange={onChangeQuery} />
            </Modal.Footer>
        </>
    );
};

export default CityModal;
