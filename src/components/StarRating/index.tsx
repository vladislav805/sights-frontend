import * as React from 'react';
import './style.scss';
import * as classNames from 'classnames';
import LoadingSpinner from '../LoadingSpinner';

type IStarRatingProps = {
    value: number;
    count: number;
    rated: number;
    enabled: boolean;
    onRatingChange?: (value: number) => Promise<void>;
};

const StarRating: React.FC<IStarRatingProps> = ({
    value,
    rated,
    count,
    enabled,
    onRatingChange,
}: IStarRatingProps) => {
    const [busy, setBusy] = React.useState<boolean>(false);
    const [hover, setHover] = React.useState<boolean>(false);
    const { addHover, removeHover } = React.useMemo(() => ({
        addHover: () => enabled && setHover(true),
        removeHover: () => enabled && setHover(false),
    }), [setHover]);

    const { onClick } = React.useMemo(() => ({
        onClick: (value: number) => {
            setBusy(true);
            onRatingChange(value === rated ? 0 : value)
                .then(() => setBusy(false));
        },
    }), [rated, onRatingChange]);

    return (
        <div className="starRating-container">
            {enabled && (
                <div className="starRating-text">
                    {/* eslint-disable-next-line */}
                    {busy
                        ? 'Подождите...'
                        : (rated ? `Вы дали оценку ${rated}` : 'Вы не оценивали')}
                </div>
            )}
            <div
                className={classNames('starRating', {
                    starRating__loading: busy,
                    starRating__enabled: enabled,
                    starRating__result: enabled && !hover,
                    starRating__hover: enabled && hover,
                    starRating__rated: rated && rated > 0,
                })}>
                <div className="starRating-spinner">
                    <LoadingSpinner size="s" />
                </div>
                <div
                    className="starRating-line"
                    onMouseEnter={addHover}
                    onMouseLeave={removeHover}
                    style={{
                        '--rated': `${((value ?? 0) * 100) / 5}%`,
                    } as React.StyleHTMLAttributes<HTMLDivElement>}>
                    {[1, 2, 3, 4, 5].map(value => (
                        <input
                            key={value}
                            className="starRating-star"
                            type="radio"
                            name="rating"
                            value={value}
                            disabled={busy || !enabled}
                            onChange={() => rated !== value && onClick(value)}
                            onClick={() => rated === value && onClick(value)}
                            checked={value === Math.floor(rated)} />
                    ))}
                </div>
                <div className="starRating-stat">
                    {(value ?? 0).toFixed(1)} ({count})
                </div>
            </div>
        </div>
    );
};

export default StarRating;
