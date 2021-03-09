import { parseQueryString, stringifyQueryString } from './qs';

describe('Query string utils', () => {
    it('should have params', () => {
        const params = parseQueryString('foo=bar&baz=12&arr=1&arr=2');
        expect(params.get('foo')).toBe('bar');
        expect(params.get('baz')).toBe('12');
        expect(params.getAll('arr')).toEqual(['1', '2']);
    });

    it('should stringify', () => {
        expect(stringifyQueryString({ n: 42 })).toEqual('n=42');
        expect(stringifyQueryString({ n: 'test' })).toEqual('n=test');
        expect(stringifyQueryString({ n: true })).toEqual('n=true');
        expect(stringifyQueryString({ n: 'котик' })).toEqual('n=%D0%BA%D0%BE%D1%82%D0%B8%D0%BA');
    });
});
