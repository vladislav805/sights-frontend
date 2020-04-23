require('./register');

const serverConfig = require('./src/build/webpack.config.server').default;
const clientConfig = require('./src/build/webpack.config.client').default;

module.exports = [serverConfig, clientConfig];
