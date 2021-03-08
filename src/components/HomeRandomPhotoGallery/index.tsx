import * as React from 'react';
import classNames from 'classnames';
import './style.scss';
import { IHomeRandomPhoto } from '../../api/local-types';
import { Link } from 'react-router-dom';
import { useCurrentWidth } from '../../utils';
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

const HomeRandomPhotoGallery: React.FC<IHomeRandomPhotoGalleryProps> = (props: IHomeRandomPhotoGalleryProps) => {
    const width = useCurrentWidth();

    const [c, r] = React.useMemo(() => calculateCountByWidth(width), [width]);
    const cellCount = c * r;

    const cells = React.useMemo<IGalleryPhoto[]>(() => {
        const photos = props.photos;

        if (!photos) {
            return [];
        }

        const cells: IGalleryPhoto[] = [];

        for (let i = 0; i < photos.length; i += 2) {
            cells.push([photos[i], photos[i + 1]]);
        }

        return cells;
    }, [cellCount, props.photos]);

    const [rotations, setRotations] = React.useState<boolean[]>(Array(cellCount).fill(false));

    React.useEffect(() => {
        const descriptor = setInterval(() => {
            const index = getRandomInt(0, cellCount);

            setRotations(rotations.map((value, i) => i === index ? !value : value));
        }, 4000);

        return () => clearInterval(descriptor);
    }, [rotations, cells, cellCount]);

    return (
        <div
            className={classNames('home-gallery', {
                'home-gallery__loading': !props.photos,
            })}
            style={{ '--hrg-height': `${r / c * 100}%` } as React.CSSProperties}>
            {cells?.map((cell, index) => (
                <div key={cell[0].sightId} className="home-gallery--entry" data-flip={+rotations[index]}>
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
