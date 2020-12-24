import * as React from 'react';
import './style.scss';
import * as Leaflet from 'leaflet';
import API, { apiExecute, IPhoto, ISight, ITag } from '../../../api';
import TextInput, { TextInputType } from '../../../components/TextInput';
import { CLASS_COMPACT, CLASS_WIDE, withCheckForAuthorizedUser, withClassBody } from '../../../hoc';
import { MapContainer } from 'react-leaflet';
import {
    getBoundsFromMap,
    getDefaultMapPosition,
    IBounds,
    MapController,
    MapTileLayers,
} from '../../../utils/map-utils';
import { IPosition } from './common';
import { SightMarker } from './sight-marker';
import { IPlace } from '../../../api/types/place';
import { RouteComponentProps } from 'react-router-dom';
import { IComponentWithUserProps } from '../../../hoc/withAwaitForUser';
import Button from '../../../components/Button';
import TagTextInput from '../../../components/TagTextInput';
import CityModal from '../../../components/CityModal';
import * as Modal from '../../../components/Modal';
import LoadingSpinner from '../../../components/LoadingSpinner';
import PhotoController from '../../../components/PhotoController';
import CategoryModal from '../../../components/CategoryModal';
import withSpinnerWrapper from '../../../components/LoadingSpinner/wrapper';

export type ISightEditProps = IComponentWithUserProps & RouteComponentProps<{
    id?: string;
}> & {
    sight: ISight;
    tags: ITag[];
};

const SightEdit: React.FC<ISightEditProps> = (props: ISightEditProps) => {
    const { center, zoom } = getDefaultMapPosition(false);

    const [sight, setSight] = React.useState<ISight>(props.sight ?? {} as ISight);
    const [position, setPosition] = React.useState<IPosition>();
    const [busy, setBusy] = React.useState<boolean>(false);
    const [map, setMap] = React.useState<Leaflet.Map>();
    // const [category, setCategory] = React.useState<ICategory>();
    const [photos, setPhotos] = React.useState<IPhoto[]>([]);
    const [tags, setTags] = React.useState<string[]>(props.tags?.map(tag => tag.title) || []);

    const [bounds, setBounds] = React.useState<IBounds>();
    const [places, setPlaces] = React.useState<IPlace[]>([]);

    const [showCityModal, setShowCityModal] = React.useState<boolean>(false);
    const [showCategoryModal, setShowCategoryModal] = React.useState<boolean>(false);

    React.useEffect(() => {
        if (props.match.params?.id) {
            setBusy(true);

            void apiExecute<{
                sight: ISight;
                tags: ITag[];
                photos: IPhoto[];
            }>('const id=+A.id,s=API.sights.getById({sightIds:id,fields:A.f}).items[0],t=API.tags.getById({tagIds:col(s.tagIds)}),p=API.photos.get({sightId:id});return{sight:s,tags:t,photos:p.items};', {
                id: props.match.params.id,
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
        }

        return () => {
            setPosition(null);
            setSight(null);
            setTags([]);
        };
    }, []);

    React.useEffect(() => {
        if (!map) {
            return;
        }

        setBounds(getBoundsFromMap(map));

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

    React.useEffect(() => {
        if (!bounds) {
            return;
        }
        const { ne, sw } = bounds;
        void API.map.getPlaces({
            topLeft: [ne.lat, ne.lng],
            bottomRight: [sw.lat, sw.lng],
            count: 100,
        }).then(res => setPlaces(res.items));
    }, [bounds]);

    const onChangeText = (name: keyof ISight, value: string) => {
        setSight({
             ...sight,
             [name]: value,
         });
    };

    const save = React.useMemo(() => {
        return async() => {
            const place = position.type === 'pin'
                ? await API.map.addPlace(position)
                : position.place;

            const isNewSight = !sight.sightId;

            const params = {
                ...sight,
                placeId: place.placeId,
                cityId: 0,
                tags,
            };

            if (sight.city) {
                params.cityId = sight.city.cityId;
            }

            if (isNewSight) {
                const result = await API.sights.add(params);

                setSight({
                    ...sight,
                    placeId: place.placeId,
                    sightId: result.sightId,
                });
            } else {
                await API.sights.edit(params);

                setSight({
                    ...sight,
                    placeId: place.placeId,
                });
            }
        };
    }, [sight, tags, position]);

    const onPhotoListChanged = React.useMemo(() => {
        return (items: IPhoto[]) => {
            setPhotos(items);
        };
    }, [photos]);

    const onSubmitForm = (event: React.FormEvent) => {
        event.preventDefault();
        setBusy(true);

        void save()
            .catch(() => void 0)
            .then(() => setBusy(false));
    };

    const {
        onPinPositionChanged,
        onPlaceSelected,
        onLocationChanged,
    } = React.useMemo(() => ({
        onPinPositionChanged: (latitude: number, longitude: number) => setPosition({
            type: 'pin',
            latitude,
            longitude,
        }),

        onPlaceSelected: (place: IPlace) => setPosition({ type: 'place', place }),

        onLocationChanged: (bounds: IBounds) => void setBounds(bounds),
    }), []);


    return (
        <form
            className="sight-edit-page"
            onSubmit={onSubmitForm}>
            <MapContainer
                className="sight-edit-map"
                center={center}
                zoom={zoom}
                whenCreated={setMap}>
                <MapTileLayers />
                <SightMarker
                    position={position}
                    places={places}
                    onPinPositionChanged={onPinPositionChanged}
                    onPlaceSelected={onPlaceSelected} />
                <MapController
                    onLocationChanged={onLocationChanged}
                    saveLocation={true} />
            </MapContainer>
            <div className="sight-edit-form">
                <TextInput
                    name="title"
                    type={TextInputType.text}
                    value={sight.title}
                    required
                    disabled={busy}
                    label="Название"
                    onChange={onChangeText} />
                <TextInput
                    name="description"
                    type={TextInputType.textarea}
                    value={sight.description}
                    disabled={busy}
                    label="Описание (не обязательно, но желательно)"
                    onChange={onChangeText} />
                <Button
                    label={`Город: ${sight.city ? sight.city.name : '*не выбран*'}`}
                    onClick={() => setShowCityModal(true)} />
                <Button
                    label={`Категория: ${sight.category ? sight.category.title : '*не выбран*'}`}
                    onClick={() => setShowCategoryModal(true)} />
                <TagTextInput
                    tags={tags}
                    onChange={setTags} />
                <PhotoController
                    sight={sight}
                    photos={photos}
                    onPhotoListChanged={onPhotoListChanged} />
                <Button
                    type="submit"
                    label="Сохранить" />
                <Modal.Window
                    show={busy}>
                    <Modal.Title>Загрузка...</Modal.Title>
                    <Modal.Content>
                        {withSpinnerWrapper(<LoadingSpinner size="l" />)}
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
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export default withClassBody([CLASS_WIDE, CLASS_COMPACT])(withCheckForAuthorizedUser(SightEdit));
