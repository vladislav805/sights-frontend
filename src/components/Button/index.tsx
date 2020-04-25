import * as React from 'react';
import './style.scss';
import classNames from 'classnames';

export interface IButtonProps {
    label: React.ReactChild;
    type?: 'button' | 'submit';
    onClick?: () => void;
    color?: 'primary' | 'secondary' | 'attention' | 'negative' | 'transparent';
    size?: 's' | 'm' | 'l';
    disabled?: boolean;
    loading?: boolean;
    className?: string;
}

const Button = ({
    label,
    onClick,
    type = 'button',
    color = 'primary',
    size = 'm',
    disabled = false,
    loading = false,
    className = '',
}: IButtonProps) => (
    <button
        className={classNames('xButton', {
            [`xButton__size-${size}`]: !!size,
            [`xButton__${color}`]: !!color,
            ['xButton__loading']: loading,
        }) + ` ${className}`}
        type={type}
        onClick={onClick}
        {...(disabled || loading && ({ disabled: true }))}>
        {label}
    </button>
);

export default Button;
