import * as React from 'react';
import './style.scss';
import Icon from '@mdi/react';

type IInfoSplashProps = {
    icon: string;
    title: string;
    description?: string;
}

const InfoSplash = ({ icon, title, description }: IInfoSplashProps) => (
    <div className="infoSplash">
        <Icon className="infoSplash-icon" path={icon} />
        <h1>{title}</h1>
        <p>{description}</p>
    </div>
);

export default InfoSplash;
