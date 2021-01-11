import * as Cookies from 'js-cookie';
import { CookieAttributes } from 'js-cookie';

export function setCookie(name: string, value: string, options: CookieAttributes = {}): void {
    Cookies.set(name, value, {
        ...options,
        path: '/',
        expires: 60,
    });
}

export function getCookie(name: string): string {
    return Cookies.get(name);
}
