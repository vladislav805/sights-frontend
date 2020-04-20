import { IUser, UserSex } from '../api';

function genderize<T = string>(user: IUser, male: T, female: T): T;
function genderize<T = string>(sex: UserSex, male: T, female: T): T;
function genderize<T = string>(src: IUser | UserSex, male: T, female: T): T | undefined {
    if (typeof src !== 'string') {
        if ('sex' in src) {
            src = src.sex;
        } else {
            return undefined;
        }
    }

    return src === UserSex.FEMALE ? female : male;
}

export { genderize };
