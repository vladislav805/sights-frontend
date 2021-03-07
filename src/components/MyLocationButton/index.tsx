import * as React from 'react';
import './style.scss';
import { Marker, useMap } from 'react-leaflet';
import { showToast } from '../../ui-non-react/toast';
import Icon from '@mdi/react';
import { mdiCrosshairsGps, mdiTimerSandEmpty } from '@mdi/js';
import { getIconMyLocation } from '../../utils/sight-icon';

const MyLocationButton: React.FC = () => {
    const map = useMap();
    const [loading, setLoading] = React.useState<boolean>(false);
    const [userLocation, setUserLocation] = React.useState<GeolocationCoordinates>();

    if (!('geolocation' in navigator)) {
        return null;
    }

    const onClick = React.useMemo(() => () => {
        setLoading(true);

        navigator.geolocation.getCurrentPosition(location => {
            setLoading(false);
            //props.onLocationChanged(location.coords);
            setUserLocation(location.coords);
            map.flyTo([location.coords.latitude, location.coords.longitude], 17, {
                duration: 1,
            });
        }, error => {
            setLoading(false);

            let text: string;

            switch (error.code) {
                case error.TIMEOUT: {
                    text = 'Не удалось получить местоположение';
                    break;
                }

                case error.PERMISSION_DENIED: {
                    text = 'Вы запретили доступ к геопозиции';
                    break;
                }

                case error.POSITION_UNAVAILABLE: {
                    text = 'Получение местоположения недоступно';
                    break;
                }
            }

            text && showToast(text, { duration: 5000 }).show();
        });
    }, []);

    return (
        <>
            <div className="leaflet-bottom leaflet-left">
                <div className="leaflet-control leaflet-bar my-location-button">
                    <a href="#" role="button" onClick={onClick}>
                        <Icon path={loading ? mdiTimerSandEmpty : mdiCrosshairsGps} size={1} />
                    </a>
                </div>
            </div>
            {userLocation && (
                <Marker
                    icon={getIconMyLocation()}
                    position={[userLocation.latitude, userLocation.longitude]}
                />
            )}
        </>
    );
};

export default MyLocationButton;
