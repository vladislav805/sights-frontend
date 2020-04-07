import * as React from 'react';
import './style.scss';
import classNames from 'classnames';

export type TextInputOnChange = (name: string, value: string) => void;

export interface ITextInputProps {
    type: TextInputType;
    name: string;
    value: string;
    defaultValue?: string;
    label: string;
    required?: boolean;
    readOnly?: boolean;
    disabled?: boolean;
    onChange?: TextInputOnChange;
}

export interface ITextInputState {
    active: boolean;
    value: string;
}

export const enum TextInputType {
    text = 'text',
    password = 'password',
    number = 'number',
    url = 'url',
    email = 'email'
}

export default class TextInput extends React.Component<ITextInputProps, ITextInputState> {
    public static defaultProps: Partial<ITextInputProps> = {
        type: TextInputType.text,
        value: '',
    };

    constructor(props: ITextInputProps) {
        super(props);

        this.state = {
            active: this.isEmpty(props.value),
            value: props.value
        };
    }

    private isEmpty = (value: string = this.state.value): boolean => value.trim().length > 0;

    private onFocus = () => this.setState({ active: true });

    private onBlur = () => this.setState({ active: this.isEmpty() });

    private onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value.trim();
        this.setState({ value });
        this.props.onChange?.(this.props.name, value);
    };

    render() {
        const {
            type,
            name,
            label,
            required,
            readOnly,
            disabled,
        } = this.props;

        const {
            value,
            active,
        } = this.state;

        const id = `input-${name}`;
        const attrs: Record<string, boolean> = {};

        required && (attrs.required = true);
        readOnly && (attrs.readOnly = true);
        disabled && (attrs.disabled = true);

        return (
            <div
                className={classNames('xInput', {
                    'xInput__active': active,
                })}>
                <input
                    type={type}
                    name={name}
                    id={id}
                    value={value}
                    onChange={this.onChange}
                    onFocus={this.onFocus}
                    onBlur={this.onBlur}
                    {...attrs} />
                <label
                    htmlFor={id}>
                    {label}
                </label>
            </div>
        );
    }
}