import * as React from 'react';
import { Link } from 'react-router-dom';
import Icon from '@mdi/react';
import { IButtonProps } from '../Button';

interface IButtonIconProps extends Omit<IButtonProps, 'label'> {
    to: string;
    path: string;
    label?: React.ReactChild;
    iconSize?: number;
    iconColor?: string;
}

const LinkIcon = ({ to, path, label, iconSize, iconColor = 'black', className = '', ...props }: IButtonIconProps) => (
    <Link
        to={to}
        className={`xButton__withIcon ${className}`}
        {...props}>
        <Icon
            path={path}
            size={`${iconSize}rem`}
            color={iconColor} />
        {label && <span className="xButton__withIcon-label">{label}</span>}
    </Link>
);

export default LinkIcon;
