import * as React from 'react';
import API, { ISight, IUser } from '../../api';
import SightsGallery from '../../components/SightsGallery/SightsGallery';
import { genderize } from '../../utils';
import LoadingSpinner from '../../components/LoadingSpinner';
import withSpinnerWrapper from '../../components/LoadingSpinner/wrapper';

type ISightsOfUserProps = {
    user: IUser;
    onNeedUpdate(): (callback: () => void) => void;
};
/*
const SightsOfUser: React.FC<ISightsOfUserProps> = ({ user, onNeedUpdate }: ISightsOfUserProps) => {

    // это нихуя не работает
    const userId = user.userId;
    const next = () => {
        if (items.length !== count || count === -1 || userId !== user.userId) {
            console.log('loading');
            const cuid = user.userId;

        }

        return () => {
            setCount(-1);
            setItems([]);
            console.log('cleared')
        };
    };

    React.useEffect(next, [user.userId]);

    const renderNothing = React.useCallback(() => (
        <div className="profile-sightGallery__empty">
            {user.firstName} ничего не {genderize(user, 'добавлял', 'добавляла')} :(
        </div>
    ), [user.userId]);

    if (count === -1) {
        return withSpinnerWrapper(<LoadingSpinner />);
    }
console.log(user.userId, items);
    return null;
}

export default SightsOfUser;
*/
