import * as React from 'react';
import './style.scss';
import Icon from '@mdi/react';
import classNames from 'classnames';

type IInfoSplashProps = {
    icon: string;
    iconSize?: 's' | 'm' | 'l';
    title?: string;
    description?: string;
}

const InfoSplash: React.FC<IInfoSplashProps> = ({ icon, title, description, iconSize = 'l' }: IInfoSplashProps) => (
    <div className="infoSplash">
        <Icon
            className={classNames('infoSplash-icon', {
                [`infoSplash-icon__size-${iconSize}`]: iconSize,
            })}
            path={icon} />
        {title && <h1>{title}</h1>}
        {description && <p>{description}</p>}
    </div>
);

export default InfoSplash;
