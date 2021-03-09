import { Format, humanizeDateTime } from '../../utils/date';
import { genderize } from '../../utils/genderize';
import type { IUser } from '../../api/types/user';

const lastSeen = (unixtime: number) => humanizeDateTime(new Date(unixtime * 1000), Format.DATE | Format.TIME);

export const getLastSeen = (user: IUser): string => user.isOnline
    ? 'Сейчас здесь'
    : `${genderize(user, 'Заходил', 'Заходила')} ${lastSeen(user.lastSeen)}`;
