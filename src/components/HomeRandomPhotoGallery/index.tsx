/* eslint-disable react/no-array-index-key */
import * as React from 'react';
import classNames from 'classnames';
import './style.scss';
import { Link } from 'react-router-dom';
import { IHomeRandomPhoto } from '../../api/local-types';
import { useCurrentWidth } from '../../utils/width';
import { getRandomInt } from '../../utils/random';

type IHomeRandomPhotoGalleryProps = {
    photos: IHomeRandomPhoto[];
};

type IGalleryPhoto = IHomeRandomPhoto[];

const calculateCountByWidth = (width: number): [number, number] => {
    if (width < 460) {
        return [3, 3];
    }

    if (width < 760) {
        return [4, 2];
    }

    return [5, 2];
};

const getTime = (): number => Math.floor(+new Date() / 1000);

// Интервал в СЕКУНДАХ, через который меняется изображение в плитке
const ROTATION_INTERVAL = 4;

// Количество итераций кулдауна плитки после изменения изображения
const ROTATION_THRESHOLD = 4;

const HomeRandomPhotoGallery: React.FC<IHomeRandomPhotoGalleryProps> = ({ photos }: IHomeRandomPhotoGalleryProps) => {
    const width = useCurrentWidth();

    const [c, r] = React.useMemo(() => calculateCountByWidth(width), [width]);
    const cellCount = c * r;

    const cells = React.useMemo<IGalleryPhoto[]>(() => {
        if (!photos) {
            return [];
        }

        const cells: IGalleryPhoto[] = [];

        for (let i = 0; i < cellCount * 2; i += 2) {
            cells.push([photos[i], photos[i + 1]]);
        }

        return cells;
    }, [cellCount, photos]);

    type IRotation = {
        state: boolean;
        time: number;
    };

    const [rotations, setRotations] = React.useState<IRotation[]>(Array(cellCount).fill({
        state: false,
        time: 0,
    } as IRotation));

    React.useEffect(() => {
        const descriptor = setInterval(() => {
            let index: number;

            const time = getTime();

            do {
                index = getRandomInt(0, cellCount);
            } while (rotations[index].time + ROTATION_INTERVAL * ROTATION_THRESHOLD > time);

            setRotations(rotations.map((item, i) => i === index ? ({
                state: !item.state,
                time,
            }) : item));
        }, ROTATION_INTERVAL * 1000);

        return () => clearInterval(descriptor);
    }, [rotations, cells, cellCount]);

    return (
        <div
            className={classNames('home-gallery', {
                'home-gallery__loading': !photos,
            })}
            style={{
                '--hrg-height': `${(r / c) * 100}%`,
            } as React.CSSProperties}>
            {cells?.map((cell, index) => (
                <div
                    key={index}
                    className="home-gallery--entry"
                    data-flip={+(rotations[index]?.state ?? 0)}>
                    {cell.map(({ photo, sightId }) => (
                        <Link
                            key={photo.photoId}
                            className="home-gallery--entry-item"
                            to={`/sight/${sightId}`}>
                            <img
                                className="home-gallery--photo"
                                src={photo.photo200}
                                alt="Фотография" />
                        </Link>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default HomeRandomPhotoGallery;
