import { IUser, UserSex } from '../../api';
import { humanizeDateTime, Format } from '../../utils/date';

const lastSeen = (unixtime: number) => humanizeDateTime(new Date(unixtime * 1000), Format.DATE | Format.TIME);

const was: Record<UserSex, string> = {
    [UserSex.FEMALE]: 'Заходила',
    [UserSex.MALE]: 'Заходил',
    [UserSex.NOT_SET]: 'Заходило',
};

export const getLastSeen = (user: IUser) => user.isOnline
    ? 'Сейчас здесь'
    : `${was[user.sex]} ${lastSeen(user.lastSeen)}`;
