import * as React from 'react';
import './style.scss';
import classNames from 'classnames';
import { SightListFilter } from '../../../components/SightFilterForm/filters';
import SightFilterForm from '../../../components/SightFilterForm';

type IMapFiltersProps = {
    onChangeFilters: (filters: SightListFilter[]) => void;
};

const MapFilters: React.FC<IMapFiltersProps> = (props: IMapFiltersProps) => {
    const [visible, setVisible] = React.useState<boolean>(false);


    const toggleVisible = React.useMemo(() => () => setVisible(!visible), [visible]);
    const onChangeFilters = React.useMemo(() => {
        return (_: string[], filters: SightListFilter[]) => {
            props.onChangeFilters(filters);
        };
    }, []);

    return (
        <div className={classNames('mapFilters', visible && 'mapFilters__visible')}>
            <div
                className="mapFilters-puller"
                onClick={toggleVisible}>
                Фильтры
            </div>
            <div className="mapFilters-content">
                <SightFilterForm
                    filterKeys={[]}
                    onChangeFilters={onChangeFilters} />
            </div>
        </div>
    );
};

export default MapFilters;
