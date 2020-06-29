import { IUser } from '../../api';
import { Format, genderize, humanizeDateTime } from '../../utils';

const lastSeen = (unixtime: number) => humanizeDateTime(new Date(unixtime * 1000), Format.DATE | Format.TIME);

export const getLastSeen = (user: IUser): string => user.isOnline
    ? 'Сейчас здесь'
    : `${genderize(user, 'Заходил', 'Заходила')} ${lastSeen(user.lastSeen)}`;
