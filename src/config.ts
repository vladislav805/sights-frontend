const Config = {
    API_BASE_DOMAIN: 'https://sights.vlad805.ru',
    API_BASE_PATH: '/api/v2/',

    // Storage key local
    SKL_AUTH_KEY: 'authKey',

    // Breakpoints from CSS
    breakpoints: {
        desktop: 1150,
        pad: 760,
    },
} as const;

export default Config;