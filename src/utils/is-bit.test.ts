import { isBit } from './is-bit';

describe('Is bit', () => {
    it('should return true, if contains bit', () => {
        expect(isBit(0b1000, 1 << 3)).toBeTruthy();
        expect(isBit(0xff, 1 << 3)).toBeTruthy();
    });

    it('should return false, if not contains bit', () => {
        expect(isBit(0b1000, 1 << 5)).toBeFalsy();
        expect(isBit(0xff, 1 << 9)).toBeFalsy();
    });
});
