import * as React from 'react';
import './style.scss';
import classNames from 'classnames';

export type ITextInputProps = {
    type?: TextInputType;
    name: string;
    value?: string;
    label: string;
    required?: boolean;
    readOnly?: boolean;
    disabled?: boolean;
    className?: string;
    onChange?: (name: string, value: string) => void;
    onFocusChange?: (name: string, focused: boolean) => void;
}

export type TextInputType =
    | 'text'
    | 'password'
    | 'number'
    | 'url'
    | 'email'
    | 'textarea';

const TextInput: React.FC<ITextInputProps> = (props: ITextInputProps) => {
    const isActive = (): boolean => props.value.trim().length > 0;
    const [active, setActive] = React.useState<boolean>(isActive());

    const {
        onFocus,
        onBlur,
    } = React.useMemo(() => {
        setActive(isActive());
        return ({
            onFocus: () => {
                setActive(true);
                props.onFocusChange?.(props.name, true);
            },
            onBlur: () => {
                setActive(isActive());
                props.onFocusChange?.(props.name, false);
            },
        });
    }, [props.value]);

    const onChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        props.onChange?.(props.name, event.target.value);
    };

    const {
        type,
        name,
        value,
        label,
        required,
        readOnly,
        disabled,
    } = props;

    const id = `input-${name}`;
    const attrs: Record<string, unknown> = {
        name,
        id,
        value,
        onChange,
        onFocus,
        onBlur,
    };

    required && (attrs.required = true);
    readOnly && (attrs.readOnly = true);
    disabled && (attrs.disabled = true);

    return (
        <div
            className={classNames('xInput', {
                'xInput__active': active,
                'xInput__textarea': type === 'textarea',
            }, props.className)}>
            {type === 'textarea' ? (
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
};

TextInput.defaultProps = {
    type: 'text',
    value: '',
};

export default TextInput;
