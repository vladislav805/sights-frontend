import * as React from 'react';
import Button, { IButtonProps } from '../Button';
import Icon from '@mdi/react';

interface IButtonIconProps extends Omit<IButtonProps, 'label'> {
    path: string;
    label?: React.ReactChild;
    iconSize?: number;
    iconColor?: string;
}

const ButtonIcon = ({ path, label, iconSize, iconColor = 'black', className = '', ...props }: IButtonIconProps) => (
    <Button
        label={(
            <>
                <Icon
                    path={path}
                    size={`${iconSize}rem`}
                    color={iconColor} />
                {label && <span className="xButton__withIcon-label">{label}</span>}
            </>
        )}
        {...props}
        className={`xButton__withIcon ${className}`} />
);

export default ButtonIcon;
