const {ipcMain} = require('electron');
const {configValidator} = require('./configError');
const config = require('./config');

module.exports = logger => {
  config.onDidAnyChange(() => {
    try {
      configValidator(config.store);
    } catch (e) {
      logger.log(e.message, 'ERROR', 'Config Manager');
    }
  });
  ipcMain.handle('config', () => config.store);
  ipcMain.handle('config-get', (_, key) => config.get(key));
  ipcMain.handle('config-set', (_, key, value) => config.set(key, value));
  ipcMain.handle('config-delete', (_, key) => config.delete(key));
  ipcMain.handle('config-reset', () => config.clear());
};
