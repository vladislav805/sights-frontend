import * as React from 'react';
import { IUser } from '../../api/types/user';
import { IRank } from '../../api/types/rank';
import { IPluralForms, pluralize } from '../../utils/pluralize';

type IProfileRankProps = {
    user: IUser;
    rank: IRank;
};

const pointsPlural: IPluralForms = {
    one: 'очко',
    some: 'очка',
    many: 'очков',
};

export const ProfileRank: React.FC<IProfileRankProps> = (props: IProfileRankProps) => {
    const { user, rank } = props;
    const { points } = user.rank;

    return (
        <div className="profile-rank">
            <div className="profile-rank--head">
                <h3 className="profile-rank--head-title">{rank.title}</h3>
                <h4>{`${points} ${pluralize(points, pointsPlural)}`}</h4>
            </div>
            <div className="profile-rank--meter">
                <div className="profile-rank--meter-min">{rank.min}</div>
                <div className="profile-rank--meter-max">{rank.max}</div>
                <div
                    className="profile-rank--meter-line"
                    style={{
                        '--rank-meter-percent': `${((points - rank.min) / (rank.max - rank.min)) * 100}%`,
                    } as React.CSSProperties} />
            </div>
        </div>
    );
};
