import * as React from 'react';
import './style.scss';
import * as classNames from 'classnames';
import LoadingSpinner from '../LoadingSpinner';

type IStarRatingProps = {
    value: number;
    count: number;
    rated: number;
    onRatingChange: (value: number) => Promise<void>;
};

const StarRating: React.FC<IStarRatingProps> = (props: IStarRatingProps) => {
    const [busy, setBusy] = React.useState<boolean>(false);

    const { onClick } = React.useMemo(() => ({
        onClick: (value: number) => {
            setBusy(true);
            void props.onRatingChange(value == props.value ? 0 : value).then(() => setBusy(false));
        },
    }), [props.rated, props.onRatingChange]);

    return (
        <div className={classNames('starRating', {
            'starRating__loading': busy,
        })}>
            <div className="starRating-spinner">
                <LoadingSpinner size="s" />
            </div>
            <div className="starRating-line">
                {[1, 2, 3, 4, 5].map(value => (
                    <input
                        key={value}
                        className="starRating-star"
                        type="radio"
                        name="rating"
                        value={value}
                        disabled={busy}
                        onChange={() => onClick(value)}
                        onClick={() => onClick(value)}
                        checked={value === Math.floor(props.rated)} />
                ))}
            </div>
            <div className="starRating-stat">
                {(props.value ?? 0).toFixed(1)} ({props.count})
            </div>
        </div>
    );
};

export default StarRating;
