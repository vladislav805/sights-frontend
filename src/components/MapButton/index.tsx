/* eslint-disable jsx-a11y/anchor-is-valid */
import * as React from 'react';
import './style.scss';
import Icon from '@mdi/react';

type IMapButtonProps = React.PropsWithChildren<{
    icon: string;
    title: string;
    onClick: () => void;
}>;

const MapButton: React.FC<IMapButtonProps> = ({ children, icon, title, onClick }: IMapButtonProps) => {
    const onClickHandler = React.useMemo(() => (event: React.MouseEvent) => {
        event.preventDefault();
        onClick();
    }, [onClick]);
    return (
        <a href="#" className="map-button" onClick={onClickHandler} title={title}>
            {children ?? <Icon path={icon} size={1} />}
        </a>
    );
};

export default MapButton;
