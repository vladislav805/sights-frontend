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
    const [selectedIndex, setSelectedIndex] = React.useState<number>(props.selectedIndex ?? 0);

    const refSelect = React.useRef<HTMLSelectElement>();

    const onSelect = React.useMemo(() => {
        return (event: React.ChangeEvent<HTMLSelectElement>) => {
            const index = event.target.selectedIndex;

            setSelectedIndex(index);

            props.onSelect?.(props.name, props.items[index]?.value);
        };
    }, [props.onSelect]);

    React.useEffect(() => {
        if (refSelect.current) {
            refSelect.current.selectedIndex = props.selectedIndex;
        }
    }, [props.selectedIndex]);

    return (
        <div className="xSelect">
            <div className="xSelect--label">{props.label}</div>
            <div className="xSelect--value">{props.items[selectedIndex]?.title}</div>
            <select
                ref={refSelect}
                className="xSelect--native"
                name={props.name}
                onChange={onSelect}>
                {props.items.map(item => (
                    <option key={item.value} value={item.value}>{item.title}</option>
                ))}
            </select>
        </div>
    );
};

export default Select;
