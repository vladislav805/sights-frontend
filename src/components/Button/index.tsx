import * as React from 'react';
import './style.scss';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import Icon from '@mdi/react';

export interface IButtonProps {
    label?: React.ReactChild;
    icon?: string;
    type?: 'button' | 'submit';
    onClick?: () => void;
    link?: string;
    color?: 'primary' | 'secondary' | 'attention' | 'negative' | 'transparent';
    size?: 's' | 'm' | 'l';
    disabled?: boolean;
    loading?: boolean;
    className?: string;
}

const Button: React.FC<IButtonProps> = ({
    label,
    icon,
    onClick,
    link,
    type = 'button',
    color = 'primary',
    size = 'm',
    disabled = false,
    loading = false,
    className = '',
}: IButtonProps) => {
    const classes = classNames('xButton', {
        'xButton__loading': loading,
        'xButton__withIcon': typeof icon === 'string',
        'xButton__onlyIcon': !label && icon,
    }, className);
    const dataAttr = {
        'data-size': size,
        'data-theme': color,
        'data-loading': +Boolean(loading),
    };
    const iconNode = React.useMemo(() =>
        typeof icon === 'string'
            ? <Icon path={icon} size={1} className="xButton-icon" />
            : null,
        [icon],
    );
    return typeof link === 'string'
        ? (
            <Link
                to={link}
                className={classes}
                {...dataAttr}
                {...(disabled || loading && ({
                    disabled: true,
                    onClick: event => event.preventDefault()
                }))}>
                {iconNode}
                {label}
            </Link>
        )
        : (
            <button
                className={classes}
                type={type}
                onClick={onClick}
                {...dataAttr}
                {...(disabled || loading && ({ disabled: true }))}>
                {iconNode}
                {label}
            </button>
        );
};

export default Button;
