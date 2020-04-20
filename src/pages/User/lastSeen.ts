import { IUser } from '../../api';
import { humanizeDateTime, Format } from '../../utils';
import { genderize } from '../../utils/genderize';

const lastSeen = (unixtime: number) => humanizeDateTime(new Date(unixtime * 1000), Format.DATE | Format.TIME);

export const getLastSeen = (user: IUser) => user.isOnline
    ? 'Сейчас здесь'
    : `${genderize(user, 'Заходил', 'Заходила')} ${lastSeen(user.lastSeen)}`;
