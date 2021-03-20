export interface IPluralForms {
    // 0 объектов
    none?: string;

    // 1 объект
    one: string;

    // 2-4 объекта
    some: string;

    // 5-20 объектов
    many: string;
}

/**
 * one - один, двадцать один и так далее
 * some - два, три, четыре, двадцать два и так далее
 * many - пять, шесть, семь, восемь, девять, десять, одиннадцать и так далее
 */
export const pluralize = (n: number, pluralForms: IPluralForms): string => {
    // eslint-disable-next-line no-param-reassign
    n = ~~n;
    const lastTwoDigits = n % 100;
    const lastDigit = n % 10;

    if (n === 0) {
        return pluralForms.none || pluralForms.many;
    }

    if ((lastTwoDigits >= 10 && lastTwoDigits < 20) || lastDigit === 0 || lastDigit >= 5) {
        return pluralForms.many;
    }

    if (lastDigit === 1) {
        return pluralForms.one;
    }

    return pluralForms.some;
};
