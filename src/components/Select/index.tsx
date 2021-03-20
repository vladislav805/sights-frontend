import * as React from 'react';
import './style.scss';

export interface ISelectProps<T = unknown> {
    selectedIndex: number;
    name: string;
    label?: string;
    items: ISelectOption<T>[];
    onSelect?: SelectOnSelect;
}

export interface ISelectOption<T = never> {
    value: string; // value
    title: string; // human value

    data?: T; // optional data from items
}

export type SelectOnSelect = (name: string, value: string) => void;

const Select: React.FC<ISelectProps> = (props: ISelectProps) => {
    const { name, label, items, selectedIndex: lSelectedIndex, onSelect: lOnSelect } = props;

    const [selectedIndex, setSelectedIndex] = React.useState<number>(lSelectedIndex ?? 0);

    const refSelect = React.useRef<HTMLSelectElement>();

    const onSelect = React.useMemo(() => (event: React.ChangeEvent<HTMLSelectElement>) => {
        const index = event.target.selectedIndex;

        setSelectedIndex(index);

        props.onSelect?.(props.name, props.items[index]?.value);
    }, [lOnSelect]);

    React.useEffect(() => {
        if (refSelect.current) {
            refSelect.current.selectedIndex = props.selectedIndex;
        }
    }, [lSelectedIndex]);

    return (
        <div className="xSelect">
            <div className="xSelect--label">{label}</div>
            <div className="xSelect--value">{items[selectedIndex]?.title}</div>
            <select
                ref={refSelect}
                className="xSelect--native"
                name={name}
                onChange={onSelect}>
                {items.map(item => (
                    <option key={item.value} value={item.value}>{item.title}</option>
                ))}
            </select>
        </div>
    );
};

export default Select;
