import { IPluralForms, pluralize } from '.';

describe('Pluralize', () => {
    const plurals: IPluralForms = {
        none: '0',
        one: '1',
        some: '2',
        many: '5',
    };

    it('should correct select form', () => {
        expect(pluralize(0, plurals)).toEqual(plurals.none);
        expect(pluralize(1, plurals)).toEqual(plurals.one);
        expect(pluralize(2, plurals)).toEqual(plurals.some);
        expect(pluralize(3, plurals)).toEqual(plurals.some);
        expect(pluralize(5, plurals)).toEqual(plurals.many);
        expect(pluralize(9, plurals)).toEqual(plurals.many);
        expect(pluralize(10, plurals)).toEqual(plurals.many);
        expect(pluralize(11, plurals)).toEqual(plurals.many);
        expect(pluralize(12, plurals)).toEqual(plurals.many);
        expect(pluralize(15, plurals)).toEqual(plurals.many);
        expect(pluralize(20, plurals)).toEqual(plurals.many);
        expect(pluralize(21, plurals)).toEqual(plurals.one);
        expect(pluralize(22, plurals)).toEqual(plurals.some);
    });

    it('should correct works with negative numbers', () => {
        expect(pluralize(-1, plurals)).toEqual(plurals.one);
    });
});
