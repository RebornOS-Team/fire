const {parse, stringify} = require('yaml');
const {errorHandler, configValidator} = require('./configError');
const Store = require('electron-store');
const defaults = {
  privateBin: {
    primaryServer: 'https://paste.rebornos.org',
    fallbackServer: 'https://bin.byreqz.de',
  },
  logs: {
    path: '/tmp',
  },
};

/**
 * @typedef {{privateBin: {primaryServer: string, fallbackServer: string}, logs: {path: string}}} FireConfig
 */

module.exports =
  /**
   * @type {Store<FireConfig>}
   */
  new Store({
    defaults,
    deserialize: str => {
      try {
        const data = {...defaults, ...parse(str)};
        if (configValidator(data)) {
          return data;
        }
      } catch (e) {
        errorHandler('CONFIG_ERROR', e.message);
        console.log('Configuration Parser Error: ', e.message);
      }
      return defaults;
    },
    serialize: stringify,
    fileExtension: 'yaml',
    name: 'fire.config',
    watch: true,
  });
