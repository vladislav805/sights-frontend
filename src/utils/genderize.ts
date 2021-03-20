import { IUser, Sex } from '../api/types/user';

function genderize<T = string>(user: IUser, male: T, female: T): T;
function genderize<T = string>(sex: Sex, male: T, female: T): T;
function genderize<T = string>(src: IUser | Sex, male: T, female: T): T | undefined {
    const sex = typeof src !== 'string'
        ? src.sex
        : src;

    if (sex === undefined) {
        return undefined;
    }

    return sex === Sex.FEMALE ? female : male;
}

export { genderize };
