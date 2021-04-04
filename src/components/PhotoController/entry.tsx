import * as React from 'react';
import './entry.scss';
import * as haversineDistance from 'haversine-distance';
import Button from '../Button';
import { IPhotoTemporary } from '../PhotoDropArea';
import { Format, humanizeDateTime } from '../../utils/date';
import { IPluralForms, pluralize } from '../../utils/pluralize';
import { ISight } from '../../api/types/sight';
import { IPhoto, PhotoType } from '../../api/types/photo';
import { IPoint } from '../../api/types/point';

type IPhotoEntryProps = {
    sight: ISight;
    photo: IPhoto | IPhotoTemporary;
    onCenterByPhoto?: (point: IPoint) => void;
    onRemove: (photo: IPhoto | IPhotoTemporary) => void;
};

const distanceCases: IPluralForms = {
    one: 'метре',
    some: 'метрах',
    many: 'метрах',
};

const PhotoEntry: React.FC<IPhotoEntryProps> = ({
    sight,
    photo,
    onCenterByPhoto: lOnCenterByPhoto,
    onRemove: lOnRemove,
}: IPhotoEntryProps) => {
    const { onRemove, onSuggest } = React.useMemo(() => ({
        onRemove: () => lOnRemove(photo),
        onSuggest: () => undefined,
    }), [photo]);

    const distance = !('temporary' in photo) && photo.latitude
        ? haversineDistance([sight.latitude, sight.longitude], [photo.latitude, photo.longitude])
        : undefined;

    // eslint-disable-next-line no-nested-ternary
    const point: IPoint = 'temporary' in photo && photo.point
        ? photo.point
        : ((photo as IPhoto).latitude ? {
            latitude: (photo as IPhoto).latitude,
            longitude: (photo as IPhoto).longitude,
        } : undefined);

    const onCenterByPhoto = React.useMemo(() => () => lOnCenterByPhoto(point), [point]);

    const distanceHuman = distance && (distance < 2
        ? 'идеально'
        : `в ${distance.toFixed(1)} ${pluralize(distance, distanceCases)} от точки на карте`);

    return (
        <div className="photoCtl-entry">
            <img
                className="photoCtl-entry--image"
                src={'temporary' in photo ? photo.thumbnail : photo.photo200}
                alt="Фото" />
            <div className="photoCtl-entry--content">
                {!('temporary' in photo) && (
                    <>
                        <div className="photoCtl-entry--content-rows">
                            <p>Дата загрузки: {humanizeDateTime(photo.date, Format.DATE)}</p>
                            {distance !== undefined && (
                                <p>Геометка на фото стоит {distanceHuman}</p>
                            )}
                        </div>

                        {!('temporary' in photo) && photo.type === PhotoType.SUGGEST && (
                            <div className="photoCtl-entry--content-suggest">
                                Эту фотографию предложил пользователь к этому месту. Если это фотография этого
                                объекта, нажмите на &laquo;Подтвердить&raquo; или &laquo;Удалить&raquo; в противном
                                случае. Спасибо!
                            </div>
                        )}
                    </>
                )}
                {'temporary' in photo && (
                    <div className="photoCtl-entry--content-date">
                        Фотография загружается...
                    </div>
                )}
                <div className="photoCtl-entry--content-actions">
                    {point && (
                        <Button
                            label="Поставить метку по локации фотографии"
                            onClick={onCenterByPhoto} />
                    )}
                    {!('temporary' in photo) && photo.type === PhotoType.SUGGEST && (
                        <Button
                            label="Подтвердить"
                            onClick={onSuggest} />
                    )}
                    {(('temporary' in photo) || photo.type !== PhotoType.SUGGEST) && (
                        <Button
                            label="Удалить"
                            onClick={onRemove} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default PhotoEntry;
