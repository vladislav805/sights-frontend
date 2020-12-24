import * as React from 'react';
import './entry.scss';
import { IPhoto, ISight, PhotoType } from '../../api';
import Button from '../Button';
import { IPhotoTemporary } from '../PhotoDropArea';
import { Format, humanizeDateTime, IPluralForms, pluralize } from '../../utils';
import * as haversineDistance from 'haversine-distance';

type IPhotoEntryProps = {
    sight: ISight;
    photo: IPhoto | IPhotoTemporary;
    onRemove: (photo: IPhoto | IPhotoTemporary) => void;
};

const distanceCases: IPluralForms = {
    one: 'метре',
    some: 'метрах',
    many: 'метрах',
};

const PhotoEntry: React.FC<IPhotoEntryProps> = (props: IPhotoEntryProps) => {
    const { photo } = props;

    const { onRemove, onSuggest } = React.useMemo(() => ({
        onRemove: () => props.onRemove(photo),
        onSuggest: () => void 0,
    }), [photo]);

    const distance = !('temporary' in photo) && photo.latitude
        ?  haversineDistance([props.sight.latitude, props.sight.longitude], [photo.latitude, photo.longitude])
        : undefined;

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
                                <p>Геометка на фото стоит {distance < 2 ? 'идеально' : `в ${distance.toFixed(1)} ${pluralize(distance, distanceCases)} от точки на карте`}</p>
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
                    {!('temporary' in photo) && photo.type === PhotoType.SUGGEST && (
                        <Button
                            label="Подтвердить"
                            onClick={onSuggest} />
                    )}
                    {('temporary' in photo) || photo.type !== PhotoType.SUGGEST && (
                        <Button
                            label="Удалить"
                            onClick={onRemove} />
                    )}
                </div>
            </div>
        </div>
    )
};

export default PhotoEntry;
