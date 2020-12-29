const Config = {
    API_BASE_DOMAIN: 'https://sights.vlad805.ru',
    API_BASE_PATH: '/api/v2/',

    MEDIA_BASE_DOMAIN: 'https://ps-sights.velu.ga/',



    DEFAULT_SIGHT_PHOTO: 'https://ps-sights.velu.ga/none-sight.png',

    // Breakpoints from CSS
    breakpoints: {
        desktop: 1150,
        pad: 760,
    },

    THIRD_PARTY: {
        VK: {
            API_ID: 6743919,
        },
    },
};

export const THIS_DOMAIN = window.location.host;
export const SKL_AUTH_KEY = 'authKey';
export const SKL_THEME = 'theme';

export default Config;
