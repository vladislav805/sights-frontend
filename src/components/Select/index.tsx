import * as React from 'react';
import './style.scss';

export interface ISelectProps<T> {
    selectedIndex: number;
    name: string;
    label?: string;
    items: ISelectOption<T>[];
    onSelect?: SelectOnSelect;
}

export interface ISelectState {
    selectedIndex: number;
}

export interface ISelectOption<T = never> {
    value: string; // value
    title: string; // human value

    data?: T; // optional data from items
}

export type SelectOnSelect = (name: string, value: string) => void;

export default class Select<T> extends React.Component<ISelectProps<T>, ISelectState> {
    state: ISelectState;

    public constructor(props: ISelectProps<T>) {
        super(props);

        this.state = {
            selectedIndex: props.selectedIndex || 0,
        };
    }

    private onSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedIndex = event.target.selectedIndex;
        const item = this.props.items[selectedIndex].value;

        this.setState({ selectedIndex });
        this.props.onSelect?.(this.props.name, item);
    };

    render(): JSX.Element {
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
