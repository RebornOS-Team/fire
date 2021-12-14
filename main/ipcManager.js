const {ipcMain, dialog} = require('electron');
const {watchFile} = require('fs');
const argsProcessor = require('./argsParser');
const {keys} = require('./constants');
const TerminalManager = require('./terminal');

let runningTasks = false;
/**
 * @function ipcManager
 * @author SoulHarsh007 <harsh.peshwani@outlook.com>
 * @copyright SoulHarsh007 2021
 * @since v1.0.0-rc.4
 * @description handles ipc communications with renderer process
 * @param {import('electron').BrowserWindow} mainWindow - The renderer window's webContents
 * @param {import('./logger')} logger - logger instance to use for logging
 */
const ipcManager = (mainWindow, logger) => {
  const args = argsProcessor();
  ipcMain.on('log', (_, data, type, meta) => logger.log(data, type, meta));
  ipcMain.on('debug', (_, data) =>
    logger.log(
      data,
      'DEBUG',
      'RebornOS Fire Renderer',
      !(process.env.DEBUG || args.debug)
    )
  );
  ipcMain.once('Loaded', () => {
    mainWindow.webContents.send('update');
    if (args.page) {
      const parsedValue =
        keys[args.page.toString().replace(',', ' ').toLowerCase()];
      if (parsedValue) {
        return mainWindow.webContents.send('Goto', parsedValue);
      } else {
        logger.log(
          `Invalid value for page: ${args.page}, Possible values: ${Object.keys(
            keys
          ).join(', ')}`,
          'WARN'
        );
      }
    }
  });
  ipcMain.handle('showLogPathSelector', () =>
    dialog.showOpenDialog(mainWindow, {
      properties: ['openDirectory'],
      buttonLabel: 'Select',
      defaultPath: '/tmp',
      title: 'Select a directory for RebornOS Fire logs',
    })
  );
  ipcMain.on('termExec', (_, command, pkg) => {
    const terminal = new TerminalManager(
      mainWindow.webContents,
      pkg,
      command,
      logger
    );
    terminal.handleCommandExecution();
    ipcMain.on('termResize', (_e, cols, rows) =>
      terminal.resizeTerminal(cols, rows)
    );
    ipcMain.on('generateLogs', () => terminal.generateLogs());
    ipcMain.on('privateBin', () => terminal.privateBin());
  });
  mainWindow.on('close', async e => {
    e.preventDefault();
    if (runningTasks) {
      const choice = dialog.showMessageBoxSync(mainWindow, {
        type: 'question',
        buttons: ['Yes', 'No'],
        title: 'Warning: Active Tasks',
        message: 'There are tasks running, are you sure you want to exit?',
      });
      if (choice) {
        return;
      }
    }
    await logger
      .generateLogFile()
      .then(x => logger.log(`Log File: ${x}`, 'DEBUG'));
    mainWindow.destroy();
  });
  ipcMain.on('StateChange', (_, state) => (runningTasks = state));
  watchFile('/var/lib/pacman/db.lck', data => {
    if (!data.blksize) {
      mainWindow.webContents.send('pacman-lock', false);
    } else if (data.blksize && !runningTasks) {
      mainWindow.webContents.send('pacman-lock', true);
    }
  });
};

module.exports = ipcManager;
