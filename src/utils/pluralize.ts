export interface IPluralForms {
    none?: string;
    one: string;
    some: string;
    many: string;
}

function pluralize(n: number, pluralForms: IPluralForms) {
    const lastTwoDigits = n % 100;
    const lastDigit = n % 10;

    if (n === 0) {
        return pluralForms.none || pluralForms.many;
    }

    if (lastTwoDigits >= 10 && lastTwoDigits < 20 || lastDigit === 0 || lastDigit >= 5) {
        return pluralForms.many;
    }

    if (lastDigit === 1) {
        return pluralForms.one;
    }

    return pluralForms.some;
}

export default pluralize;
