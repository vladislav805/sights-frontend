import * as React from 'react';
import { useMapEvents } from 'react-leaflet';
import { stringifyQueryString } from '../../utils/qs';
import { getBoundsFromMap, IBounds, mapPrefs, PREF_LAST_CENTER, PREF_LAST_ZOOM, PREF_LAYER } from '../../utils/map-utils';
import { Map } from 'leaflet';

type IMapControllerProps = Partial<{
    saveLocation: boolean;
    setLocationInAddress: boolean;
    onLocationChanged?(bounds: IBounds, map: Map): unknown;
    needInvalidateSize: boolean;
}>;

const getMainElement = (node: HTMLElement): HTMLElement => {
    while ((node = node.parentElement) !== null) {
        if (node.classList.contains('main-container')) {
            return node;
        }
    }
    return null;
};

/**
 * Настройщик поведения карты
 * @param props
 */
const MapConfigurator: React.FC<IMapControllerProps> = (props: IMapControllerProps) => {
    // noinspection SpellCheckingInspection
    const map = useMapEvents({
        /**
         * При изменении вьюпорта карты, если указано в пропсах
         * - Сохраняем положение карты в localStorage
         * - Меняем адрес
         * - Вызываем колбек (если указан) с переачей вьюпорта и карты
         */
        moveend: () => {
            const { lat, lng } = map.getCenter();

            if (props.saveLocation) {
                mapPrefs(PREF_LAST_CENTER, `${lat},${lng}`);
                mapPrefs(PREF_LAST_ZOOM, String(map.getZoom()));
            }

            if (props.setLocationInAddress) {
                // anti pattern :(
                window.history.replaceState(null, null, '?' + stringifyQueryString({
                    c: [lat.toFixed(5), lng.toFixed(5)].join(','),
                    z: map.getZoom(),
                }))
            }

            props.onLocationChanged?.(getBoundsFromMap(map), map);
        },

        /**
         * При изменении видимого слоя карты сохраняем его
         */
        baselayerchange: event => {
            mapPrefs(PREF_LAYER, event.name);
        },
    });


    React.useEffect(() => {
        /**
         * Исправляет косяк: при увеличении ширины страницы, leaflet рендерит тайлы
         * только для той ширины, которая была при инициализации карты. Здесь же
         * вешаем обработчик за завершение анимации на main-container, обновляем
         * размеры и убираем обработчик
         */
        if (props.needInvalidateSize) {
            /**
             * Колбек, вызываемый при окончании анимации
             */
            let callback = () => {
                // Если колбека уже нет - его сняли
                if (!callback) {
                    return;
                }

                // Меняем размер карты
                map.invalidateSize(true);

                // Сносим колбек
                resetCallback();
            };

            const resetCallback = () => {
                if (callback) {
                    // Убираем обработчик
                    main.removeEventListener('transitionend', callback);
                    // Зачищаем колбек
                    callback = null;
                }
            };

            const main = getMainElement(map.getContainer());
            main.addEventListener('transitionend', callback);

            /**
             * Через секунду, если анимация уже произошла - колбек удалился, но
             * если вдруг контейнер не анимировался (например, маленький экран),
             * то transitionend никогда не произойдёт и обработчик события так и
             * будет висеть, Его нужно убрать, если он не выполнился
             */
            setTimeout(() => resetCallback(), 1000);
        }

        map.zoomControl.setPosition('bottomright');
    }, []);

    return (<></>);
};

export default MapConfigurator;
