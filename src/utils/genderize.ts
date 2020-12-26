import { IUser, Sex } from '../api/types/user';

function genderize<T = string>(user: IUser, male: T, female: T): T;
function genderize<T = string>(sex: Sex, male: T, female: T): T;
function genderize<T = string>(src: IUser | Sex, male: T, female: T): T | undefined {
    if (typeof src !== 'string') {
        if ('sex' in src) {
            src = src.sex;
        } else {
            return undefined;
        }
    }

    return src === Sex.FEMALE ? female : male;
}

export { genderize };
