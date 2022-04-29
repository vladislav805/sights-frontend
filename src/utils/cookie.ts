import cookies from 'js-cookie';
import type { CookieAttributes } from 'js-cookie';

const { get, remove, set } = cookies;

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
    console.log(cookies);
    return get(name);
}
