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

export enum TextInputType {
    text = 'text',
    password = 'password',
    number = 'number',
    url = 'url',
    email = 'email',
    textarea = 'textarea',
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
            value: props.value,
        };
    }

    componentDidUpdate(prevProps: Readonly<ITextInputProps>, prevState: Readonly<ITextInputState>) {
        if (prevProps.value !== this.props.value) {
            this.setState({ value: this.props.value });
        }
    }

    private isEmpty = (value: string = this.state.value): boolean => value.trim().length > 0;

    private onFocus = () => this.setState({ active: true });

    private onBlur = () => this.setState({ active: this.isEmpty() });

    private onChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const value = event.target.value;
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
        const attrs: Record<string, boolean | string | Function> = {
            name,
            id,
            value,
            onChange: this.onChange,
            onFocus: this.onFocus,
            onBlur: this.onBlur,
        };

        required && (attrs.required = true);
        readOnly && (attrs.readOnly = true);
        disabled && (attrs.disabled = true);

        return (
            <div
                className={classNames('xInput', {
                    'xInput__active': active,
                    'xInput__textarea': type === TextInputType.textarea,
                })}>
                {type === TextInputType.textarea ? (
                    <textarea {...attrs}>{value}</textarea>
                ) : (
                    <input type={type} {...attrs} />
                )}
                <label
                    htmlFor={id}>
                    {label}
                </label>
            </div>
        );
    }
}