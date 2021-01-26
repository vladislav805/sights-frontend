import * as Cookies from 'js-cookie';
import { CookieAttributes } from 'js-cookie';

export function setCookie(name: string, value: string, options: CookieAttributes = {}): void {
    const defaultOptions = {
        path: '/',
        expires: 60,
    };

    if (value !== null && value !== undefined) {
        Cookies.set(name, value, {
            ...options,
            ...defaultOptions,
        });
    } else {
        Cookies.remove(name, defaultOptions);
    }
}

export function getCookie(name: string): string {
    return Cookies.get(name);
}
