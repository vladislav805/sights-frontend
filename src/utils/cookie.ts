import * as cookies from 'js-cookie';
import type { CookieAttributes } from 'js-cookie';

// Ёбаные костыли из-за ESM
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const { get, remove, set } = cookies.default;

export function setCookie(name: string, value: string, options: CookieAttributes = {}): void {
    const defaultOptions = {
        path: '/',
        expires: 60,
    };

    if (value !== null && value !== undefined) {
        set(name, value, {
            ...options,
            ...defaultOptions,
        });
    } else {
        remove(name, defaultOptions);
    }
}

export function getCookie(name: string): string {
    return get(name);
}
