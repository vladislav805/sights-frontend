import * as React from 'react';
import './style.scss';
import * as Leaflet from 'leaflet';
import { MapContainer } from 'react-leaflet';
import { mdiMapMarkerRadius } from '@mdi/js';
import { useHistory, useParams } from 'react-router-dom';
import API, { apiExecute } from '../../../api';
import TextInput from '../../../components/TextInput';
import { CLASS_COMPACT, CLASS_WIDE, withClassBody } from '../../../hoc';
import {
    getBoundsFromMap,
    getDefaultMapPosition,
    IBounds,
    MapTileLayers,
} from '../../../utils/map-utils';
import { IPosition } from './common';
import { SightMarker } from './sight-marker';
import { IPlace } from '../../../api/types/place';
import Button from '../../../components/Button';
import TagTextInput from '../../../components/TagTextInput';
import CityModal from '../../../components/CityModal';
import * as Modal from '../../../components/Modal';
import LoadingSpinner from '../../../components/LoadingSpinner';
import PhotoController from '../../../components/PhotoController';
import CategoryModal from '../../../components/CategoryModal';
import FakeTextInput from '../../../components/FakeTextInput';
import { ISight } from '../../../api/types/sight';
import { ITag } from '../../../api/types/tag';
import { IPhoto } from '../../../api/types/photo';
import PageTitle from '../../../components/PageTitle';
import { IPoint } from '../../../api/types/point';
import Checkbox from '../../../components/Checkbox';
import { withSessionOnly } from '../../../hoc/withSessionOnly';
import { showToast } from '../../../ui-non-react/toast';
import MapConfigurator from '../../../components/MapConfigurator';

export type ISightEditProps = {
    id?: string;
};

const SightEdit: React.FC = () => {
    // доступ к параметрам URL
    const params = useParams<ISightEditProps>();

    // история для изменения урла при создании достопримечательности
    const history = useHistory();

    // стандартное положение карты из localStorage
    const { center, zoom } = getDefaultMapPosition(false);

    // объект достопримечательности
    const [sight, setSight] = React.useState<ISight>({} as ISight);

    // позиция на карте, два типа: pin (точка на карте) и place (уже существующее место)
    const [position, setPosition] = React.useState<IPosition>();

    // занятость (показывается оверлей загрузки)
    const [busy, setBusy] = React.useState<boolean>(false);

    // объект карты (доступен не с самого начала, проверка на null обязательна)
    const [map, setMap] = React.useState<Leaflet.Map>();

    // массив с фотками
    const [photos, setPhotos] = React.useState<IPhoto[]>([]);

    // массив тегов (только строк)
    const [tags, setTags] = React.useState<string[]>(null);

    // текущая видимая область карты
    const [bounds, setBounds] = React.useState<IBounds>();

    // уже существующие места в текущей видимой области карты
    const [places, setPlaces] = React.useState<IPlace[]>([]);

    // показывать ли существующие места (мешает при установке новых, которые
    // находятся рядом, но полезно, когда ставишь на место архивных
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [showPlaces, setShowPlaces] = React.useState<boolean>(false);

    // используется один раз: при открытии уже существующей достопримечательности
    // карта по умолчанию стоит в положении из localStorage, а надо - на месте
    // достопримечательности. поскольку карта и достопримечательность загружаются
    // асинхронно и в разное время, в разном порядке, нужно отслеживать когда они
    // будут готовы оба, вместо случая, когда карта готова, но нет координат или
    // есть координаты, но на карте их не выставить, потому что её нет.
    // применяется эффект на эти два объекта и этот флаг, если флаг = false, а
    // карта и достопримечательность загрузились - можно передвигать карту куда
    // надо. после это меняем флаг, чтобы каждый раз не центровать карту
    const [moved, setMoved] = React.useState(false);

    // модальное окно выбора города
    const [showCityModal, setShowCityModal] = React.useState<boolean>(false);

    // модальное окно выбора категории
    const [showCategoryModal, setShowCategoryModal] = React.useState<boolean>(false);

    // Если урл вида /sight/NNN/edit, то нужно подгрузить информацию о
    // достопримечательности
    React.useEffect(() => {
        if (params?.id) {
            setBusy(true);

            apiExecute<{
                sight: ISight;
                tags: ITag[];
                photos: IPhoto[];
            }>('const id=+A.id,s=API.sights.getById({sightIds:id,fields:A.f}).items[0],'
                + 't=API.tags.getById({tagIds:s.tags}),p=API.photos.get({sightId:id});'
                + 'return{sight:s,tags:t,photos:p.items};', {
                id: params.id,
                f: ['city', 'tags'],
            }).then(({ sight, tags, photos }) => {
                setSight(sight);
                setTags(tags.map(tag => tag.title));
                setPhotos(photos);
                setBusy(false);
                setPosition({
                    type: 'place',
                    place: sight,
                });
            });
        } else {
            setMoved(true);
        }

        return () => {
            setPosition(null);
            setSight(null);
            setTags([]);
        };
    }, []);

    // Когда карта готова
    React.useEffect(() => {
        if (!map) {
            return;
        }

        // меняем область карты (=> загружаем места в ней)
        setBounds(getBoundsFromMap(map));

        // при клике по карте - меняем позицию
        map.on('click', (event: Leaflet.LeafletMouseEvent) => {
            // хак, ибо при перетаскивании пользовательской метки срабатывает
            // клик и метка улетает на позицию курсора
            if ((event.originalEvent.target as HTMLElement)?.tagName === 'IMG') {
                return;
            }

            setPosition({
                type: 'pin',
                latitude: event.latlng.lat,
                longitude: event.latlng.lng,
            });
        });
    }, [map]);

    // см. state moved
    React.useEffect(() => {
        if (!moved && sight.latitude && map) {
            map.panTo([sight.latitude, sight.longitude]);
            setMoved(true);
        }
    }, [sight, map]);

    // пр изменении видимой области подгружаем места
    React.useEffect(() => {
        if (!bounds) {
            return;
        }

        const { ne, sw } = bounds;

        API.map.getPlaces({
            topLeft: [ne.lat, ne.lng],
            bottomRight: [sw.lat, sw.lng],
            count: 100,
        }).then(res => setPlaces(res.items));
    }, [bounds]);

    // изменение текста
    const onChangeText = (name: keyof ISight, value: string) => {
        setSight({
            ...sight,
            [name]: value,
        });
    };

    const save = React.useMemo(() => async() => {
        if (!position) {
            showToast(
                'Не поставлена метка на карте. Нельзя создать достопримечательность без указания её '
                + 'местонахождения. Если не уверены - впишите тег #неточно',
                { duration: 10000 },
            );
            return;
        }

        const place = position.type === 'pin'
            ? await API.map.addPlace(position)
            : position.place;

        const isNewSight = !sight.sightId;

        const params = {
            ...sight,
            placeId: place.placeId,
            cityId: undefined as number,
            categoryId: undefined as number,
            tags: tags?.filter(Boolean) ?? [],
        };

        if (sight.city) {
            params.cityId = sight.city.cityId;
        }

        if (sight.category) {
            params.categoryId = sight.category.categoryId;
        }

        let { sightId } = params;
        if (isNewSight) {
            const result = await API.sights.add(params);

            setSight({
                ...sight,
                placeId: place.placeId,
                sightId: result.sightId,
            });

            sightId = result.sightId;
        } else {
            await API.sights.edit(params);

            setSight({
                ...sight,
                placeId: place.placeId,
            });
        }

        if (photos) {
            await API.sights.setPhotos({
                sightId,
                photoIds: photos.map(photo => photo.photoId),
            });
        }

        if (isNewSight) {
            history.replace(`/sight/${sightId}/edit`);
        }
    }, [sight, tags, position, photos]);

    // при изменениях в фото-контроллере меняем список здесь
    const onPhotoListChanged = React.useMemo(() => (items: IPhoto[]) => setPhotos(items), [photos]);

    const onSubmitForm = (event: React.FormEvent) => {
        event.preventDefault();
        setBusy(true);

        save()
            .catch((error: Error) => showToast(error.message))
            .then(() => setBusy(false));
    };

    const { onPinPositionChanged,
        onPlaceSelected,
        onLocationChanged,
        onCenterByPhoto } = React.useMemo(() => ({
        onPinPositionChanged: (latitude: number, longitude: number) => setPosition({
            type: 'pin',
            latitude,
            longitude,
        }),

        onPlaceSelected: (place: IPlace) => setPosition({ type: 'place', place }),

        onLocationChanged: (bounds: IBounds) => setBounds(bounds),

        onCenterByPhoto: ({ latitude, longitude }: IPoint) => setPosition({
            type: 'pin',
            latitude,
            longitude,
        }),
    }), []);

    return (
        <form
            className="sight-edit-page"
            onSubmit={onSubmitForm}>
            <PageTitle
                backLink={sight.sightId ? `/sight/${sight.sightId}` : undefined}>
                {sight.sightId ? `Редактирование «${sight.title}»` : 'Добавление достопримечательности'}
            </PageTitle>
            <MapContainer
                className="sight-edit-map"
                center={center}
                zoom={zoom}
                whenCreated={setMap}>
                <MapTileLayers />
                <SightMarker
                    position={position}
                    places={showPlaces ? places : []}
                    onPinPositionChanged={onPinPositionChanged}
                    onPlaceSelected={onPlaceSelected} />
                <MapConfigurator
                    needInvalidateSize
                    saveLocation
                    onLocationChanged={onLocationChanged} />
            </MapContainer>
            <div className="sight-edit-form">
                <Checkbox
                    name="showPlaces"
                    label="Показывать существующие места"
                    checked={showPlaces}
                    verticalMargin={false}
                    onSetChecked={(_, state) => setShowPlaces(state)} />
                <TextInput
                    name="title"
                    type="text"
                    value={sight.title}
                    required
                    disabled={busy}
                    label="Название"
                    onChange={onChangeText} />
                <TextInput
                    name="description"
                    type="textarea"
                    value={sight.description}
                    disabled={busy}
                    label="Описание (не обязательно, но желательно)"
                    onChange={onChangeText} />
                <FakeTextInput
                    label="Город"
                    value={sight.city ? sight.city.name : 'не выбран'}
                    onClick={() => setShowCityModal(true)} />
                <FakeTextInput
                    label="Категория"
                    value={sight.category ? sight.category.title : 'не выбрана'}
                    onClick={() => setShowCategoryModal(true)} />
                <PhotoController
                    sight={sight}
                    photos={photos}
                    onCenterByPhoto={onCenterByPhoto}
                    onPhotoListChanged={onPhotoListChanged} />
                {tags && (
                    <TagTextInput
                        tags={tags}
                        onChange={setTags} />
                )}
                <Button
                    type="submit"
                    icon={mdiMapMarkerRadius}
                    label="Сохранить" />
                <Modal.Window
                    show={busy}>
                    <Modal.Title>Загрузка...</Modal.Title>
                    <Modal.Content>
                        <LoadingSpinner
                            block
                            size="l" />
                    </Modal.Content>
                </Modal.Window>
                <Modal.Window
                    show={showCityModal}
                    onOverlayClick={() => setShowCityModal(false)}>
                    <CityModal
                        selected={sight?.city}
                        onChange={city => {
                            setSight({ ...sight, city });
                            setShowCityModal(false);
                        }} />
                </Modal.Window>
                <Modal.Window
                    show={showCategoryModal}
                    onOverlayClick={() => setShowCategoryModal(false)}>
                    <CategoryModal
                        selected={sight?.category}
                        onChange={category => {
                            setSight({ ...sight, category });
                            setShowCategoryModal(false);
                        }} />
                </Modal.Window>
            </div>
        </form>
    );
};

export default withClassBody([CLASS_WIDE, CLASS_COMPACT])(withSessionOnly(SightEdit));
