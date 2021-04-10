import * as React from 'react';
import { Marker, useMap } from 'react-leaflet';
import { mdiCrosshairsGps, mdiTimerSandEmpty } from '@mdi/js';
import { showToast } from '../../ui-non-react/toast';
import { getIconMyLocation } from '../../utils/sight-icon';
import MapButton from '../MapButton';

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
            // props.onLocationChanged(location.coords);
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

            if (text) {
                showToast(text, { duration: 5000 }).show();
            }
        });
    }, []);

    return (
        <>
            <MapButton
                icon={loading ? mdiTimerSandEmpty : mdiCrosshairsGps}
                title="Показать моё местоположение"
                onClick={onClick} />
            {userLocation && (
                <Marker
                    icon={getIconMyLocation()}
                    position={[userLocation.latitude, userLocation.longitude]} />
            )}
        </>
    );
};

export default MyLocationButton;
