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
};

export type TextInputType =
    | 'text'
    | 'password'
    | 'number'
    | 'url'
    | 'email'
    | 'textarea';

const TextInput: React.FC<ITextInputProps> = ({
    type,
    name,
    value,
    label,
    onChange,
    className,
    disabled,
    required,
    readOnly,
    onFocusChange,
}: ITextInputProps) => {
    const isActive = (): boolean => value.trim().length > 0;
    const [active, setActive] = React.useState<boolean>(isActive());

    const {
        onFocus,
        onBlur,
    } = React.useMemo(() => {
        setActive(isActive());
        return ({
            onFocus: () => {
                setActive(true);
                onFocusChange?.(name, true);
            },
            onBlur: () => {
                setActive(isActive());
                onFocusChange?.(name, false);
            },
        });
    }, [value]);

    const onChangeListener = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        onChange?.(name, event.target.value);
    };

    const id = `input-${name}`;
    const attrs: Record<string, unknown> = {
        name,
        id,
        value,
        onChange: onChangeListener,
        onFocus,
        onBlur,
    };

    if (required) {
        attrs.required = true;
    }

    if (readOnly) {
        attrs.readOnly = true;
    }

    if (disabled) {
        attrs.disabled = true;
    }

    return (
        <div
            className={classNames('xInput', {
                xInput__active: active,
                xInput__textarea: type === 'textarea',
            }, className)}>
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
