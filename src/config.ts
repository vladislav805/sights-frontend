const Config = {
    API_BASE_DOMAIN: 'https://sights.vlad805.ru',
    API_BASE_PATH: '/api/v2/',

    MEDIA_BASE_DOMAIN: 'https://ps-sights.velu.ga/',

    // Storage key local
    SKL_AUTH_KEY: 'authKey',
    SKL_THEME: 'theme',

    DEFAULT_SIGHT_PHOTO: 'https://ps-sights.velu.ga/none-sight.png',

    // Breakpoints from CSS
    breakpoints: {
        desktop: 1150,
        pad: 760,
    },

    vk: {
        clientId: 6743919,
        redirectUri: `${process.env.DOMAIN}/island/vk`,
        scope: 4194304,
        apiVersion: '5.103',
    } as const,
};

export default Config;
