import { humanizeDistance } from '.';

describe('Distance', () => {
    it('should be meters if passed n < 1000', () => {
        expect(humanizeDistance(800)).toBe('800 м');
    });

    it('should be meters if passed n < 1000 and toKm = true', () => {
        expect(humanizeDistance(800, true)).toBe('800 м');
    });

    it('should be meters if passed n > 1000', () => {
        expect(humanizeDistance(1425)).toBe('1425 м');
    });

    it('should be kilometers if passed n > 1000 and toKm = true', () => {
        expect(humanizeDistance(1425, true)).toBe('1.43 км');
    });

    it('should be n = 0 if specify n < 0', () => {
        expect(humanizeDistance(-500)).toBe('0 м');
    });

    it('should be round n if specify n float', () => {
        expect(humanizeDistance(654.158)).toBe('654 м');
    });
});
