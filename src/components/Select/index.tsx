import * as React from 'react';
import './style.scss';

export interface ISelectProps<T> {
    selectedIndex: number;
    name: string;
    label?: string;
    items: ISelectOption<T>[];
    onSelect?: SelectOnSelect<T>;
}

export interface ISelectState {
    selectedIndex: number;
}

export interface ISelectOption<T> {
    value: string | number; // value
    title: string; // human value

    data?: T; // optional data from items
}

export type SelectOnSelect<T> = (name: string, index: number, item: T) => void;

export default class Select<T> extends React.Component<ISelectProps<T>, ISelectState> {
    state: ISelectState;

    constructor(props: ISelectProps<T>) {
        super(props);

        this.state = {
            selectedIndex: props.selectedIndex || 0,
        };
    }

    private onSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedIndex = event.target.selectedIndex;
        const item: T = this.props.items[selectedIndex].data;

        this.setState({ selectedIndex });
        this.props.onSelect?.(this.props.name, selectedIndex, item);
    };

    render() {
        const { name, label, items } = this.props;
        const { selectedIndex } = this.state;

        return (
            <div className="xSelect">
                <div className="xSelect--label">{label}</div>
                <div className="xSelect--value">{items[selectedIndex].title}</div>
                <select
                    className="xSelect--native"
                    name={name}
                    onChange={this.onSelect}>
                    {items.map(item => (
                        <option key={item.value} value={item.value}>{item.title}</option>
                    ))}
                </select>
            </div>
        );
    }
}
