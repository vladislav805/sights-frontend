import * as React from 'react';
import './style.scss';
import * as classNames from 'classnames';
import LoadingSpinner from '../LoadingSpinner';

type IStarRatingProps = {
    value: number;
    count: number;
    rated: number;
    enabled: boolean;
    onRatingChange: (value: number) => Promise<void>;
};

const StarRating: React.FC<IStarRatingProps> = (props: IStarRatingProps) => {
    const [busy, setBusy] = React.useState<boolean>(false);
    const [hover, setHover] = React.useState<boolean>(false);
    const { addHover, removeHover } = React.useMemo(() => ({
        addHover: () => setHover(true),
        removeHover: () => setHover(false),
    }), [setHover]);

    const { onClick } = React.useMemo(() => ({
        onClick: (value: number) => {
            setBusy(true);
            void props.onRatingChange(value === props.rated ? 0 : value)
                .then(() => setBusy(false));
        },
    }), [props.rated, props.onRatingChange]);


    return (
        <div className="starRating-container">
            {props.enabled && (
                <div className="starRating-text">
                    {busy
                        ? 'Подождите...'
                        : (props.rated ? `Вы дали оценку ${props.rated}` : 'Вы не оценивали')
                    }
                </div>
            )}
            <div
                className={classNames('starRating', {
                    'starRating__loading': busy,
                    'starRating__enabled': props.enabled,
                    'starRating__result': !hover,
                    'starRating__hover': props.enabled && hover,
                    'starRating__rated': props.rated && props.rated > 0,
                })}>
                <div className="starRating-spinner">
                    <LoadingSpinner size="s" />
                </div>
                <div
                    className="starRating-line"
                    onMouseEnter={addHover}
                    onMouseLeave={removeHover}
                    style={{
                        '--rated': `${(props.value ?? 0) * 100 / 5}%`
                    } as React.StyleHTMLAttributes<HTMLDivElement>}>
                    {[1, 2, 3, 4, 5].map(value => (
                        <input
                            key={value}
                            className="starRating-star"
                            type="radio"
                            name="rating"
                            value={value}
                            disabled={busy || !props.enabled}
                            onChange={() => props.rated !== value && onClick(value)}
                            onClick={() => props.rated === value && onClick(value)}
                            checked={value === Math.floor(props.rated)} />
                    ))}
                </div>
                <div className="starRating-stat">
                    {(props.value ?? 0).toFixed(1)} ({props.count})
                </div>
            </div>
        </div>
    );
};

export default StarRating;
