const Config = {
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
        Telegram: {
            BOT_USERNAME: 'SightsMapBot',
        },
    },

    isServer: Boolean(process.env.SERVER_ENV),
};

export const THIS_DOMAIN = !Config.isServer ? window.location.host : '0';
export const SKL_AUTH_KEY = 'authKey';
export const SKL_THEME = 'theme';

export default Config;
