import { toRange } from './toRange';

describe('toRange function', () => {
    it('should return same number if in range', () => {
        expect(toRange(5, 0, 10)).toBe(5);
    });

    it('should return min value if out of minimal range', () => {
        expect(toRange(-5, 0, 10)).toBe(0);
    });

    it('should return max value if out of maximum range', () => {
        expect(toRange(15, 0, 10)).toBe(10);
    });
});
