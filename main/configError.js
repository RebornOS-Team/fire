const {ipcMain} = require('electron');
const {mkdirSync} = require('fs');
const isURL = require('validator/lib/isURL');
const errors = [];
let handlerEnabled = false;

/**
 * @typedef {{privateBin: {primaryServer: string, fallbackServer: string}, logs: {path: string}}} FireConfig
 */

/**
 * @function errorHandler
 * @author SoulHarsh007 <harsh.peshwani@outlook.com>
 * @copyright SoulHarsh007 2021
 * @since v1.0.0-rc.4
 * @description config error manager
 * @param {'CONFIG_ERROR' | 'INVALID_LOG_PATH' | 'INVALID_SCHEMA' | 'INVALID_URL'} errorCode - error code for the config error
 * @param {string} description - description for the config error
 * @param {boolean} [resolve] - mark error as resolved
 */
const errorHandler = (errorCode, description, resolve) => {
  if (!handlerEnabled) {
    ipcMain.handle('config-error', () => errors);
    ipcMain.handle('config-error-fix', () => {
      const index = errors.findIndex(x => x.code === 'CONFIG_ERROR');
      if (index !== -1) {
        errors.splice(index, 1);
      }
    });
    handlerEnabled = true;
  }
  if (resolve) {
    if (errors.length) {
      const index = errors.findIndex(x => x.code === errorCode);
      if (index !== -1) {
        errors.splice(index, 1);
      }
    }
  } else if (!errors.find(x => x.code === errorCode)) {
    errors.push({
      code: errorCode,
      description,
    });
  }
};

/**
 * @function configValidator
 * @author SoulHarsh007 <harsh.peshwani@outlook.com>
 * @copyright SoulHarsh007 2021
 * @since v1.0.0-rc.4
 * @description validates the configuration
 * @param {FireConfig} config - the configuration parsed
 * @returns {boolean} returns true if configuration is valid, else returns false
 */
const configValidator = config => {
  errorHandler('', null, true);
  if (typeof config.privateBin.primaryServer !== 'string') {
    errorHandler(
      'INVALID_SCHEMA',
      `Expected privateBin.primaryServer to be a string, but got: ${typeof config
        .privateBin.primaryServer} instead`
    );
    return false;
  } else {
    errorHandler('INVALID_SCHEMA', null, true);
  }
  if (typeof config.privateBin.fallbackServer !== 'string') {
    errorHandler(
      'INVALID_SCHEMA',
      `Expected privateBin.fallbackServer to be a string, but got: ${typeof config
        .privateBin.fallbackServer} instead`
    );
    return false;
  } else {
    errorHandler('INVALID_SCHEMA', null, true);
  }
  if (typeof config.logs.path !== 'string') {
    errorHandler(
      'INVALID_SCHEMA',
      `Expected logs.path to be a string, but got: ${typeof config.logs
        .path} instead`
    );
    return false;
  } else {
    errorHandler('INVALID_SCHEMA', null, true);
  }
  if (!isURL(`${config.privateBin.primaryServer}`)) {
    errorHandler(
      'INVALID_URL',
      `Invalid URL: ${config.privateBin.primaryServer} (Reading: privateBin.primaryServer)`
    );
    return false;
  } else {
    errorHandler('INVALID_URL', null, true);
  }
  if (!isURL(`${config.privateBin.fallbackServer}`)) {
    errorHandler(
      'INVALID_URL',
      `Invalid URL: ${config.privateBin.fallbackServer} (Reading: privateBin.fallbackServer)`
    );
    return false;
  } else {
    errorHandler('INVALID_URL', null, true);
  }
  try {
    mkdirSync(config.logs.path, {recursive: true});
    errorHandler('INVALID_URL', null, true);
  } catch (error) {
    console.log('Invalid Logs Path: ', error.message);
    errorHandler(
      'INVALID_LOG_PATH',
      `Invalid logs directory: ${config.logs.path}`
    );
    return false;
  }
  return true;
};

module.exports = {errorHandler, configValidator};
