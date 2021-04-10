import * as React from 'react';
import classNames from 'classnames';

type IMapControlBoxProps = React.PropsWithChildren<{
    horizontal: 'left' | 'right';
    vertical: 'top' | 'bottom';
}>;

const MapControlBox: React.FC<IMapControlBoxProps> = ({ vertical, horizontal, children }: IMapControlBoxProps) => (
    <div className={classNames(`leaflet-${vertical} leaflet-${horizontal}`)}>
        <div className="leaflet-control leaflet-bar">
            {children}
        </div>
    </div>
);

export default MapControlBox;
