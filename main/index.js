const {app, BrowserWindow, dialog, ipcMain} = require('electron');
const serve = require('electron-serve');
const {inspect} = require('util');
const TerminalManager = require('./terminal');
const Logger = require('./logger');
const args = require('./argsParser')();
const logger = new Logger('RebornOS Fire Main');

logger.log(`Start TimeStamp: ${new Date()}`, 'INFO');
if (process.env.DEBUG || args.debug) {
  logger.log(`Raw Args: ${process.argv.slice(2)}`, 'DEBUG');
  process
    .on('unhandledRejection', (reason, promise) =>
      logger.log(
        `Unhandled Rejection at: ${inspect(promise)} reason: ${inspect(
          reason
        )}`,
        'ERROR'
      )
    )
    .on('uncaughtException', (err, origin) =>
      logger.log(`Error: ${inspect(err)} at ${inspect(origin)}`, 'ERROR')
    )
    .on('warning', e => logger.log(`${inspect(e)}`, 'WARN'));
}

logger.log(`Spawn Args: ${JSON.stringify(args) || 'None'}`, 'INFO');
let runningTasks = false;
process.env.NODE_ENV === 'production'
  ? serve({
      directory: 'app',
    })
  : app.setPath('userData', `${app.getPath('userData')} (development)`);
app.whenReady().then(() => {
  const mainWindow = new BrowserWindow({
    width: 1000,
    height: 600,
    icon: 'app://./icon.png',
    show: false,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  ipcMain.on('termExec', (_event, command, pkg) => {
    const terminal = new TerminalManager(mainWindow, pkg, command);
    terminal.handleCommandExecution();
    ipcMain.on('termResize', (_event, cols, rows) =>
      terminal.resizeTerminal(cols, rows)
    );
    ipcMain.on('generateLogs', () => terminal.generateLogs());
    ipcMain.on('privateBin', () => terminal.privateBin());
  });
  mainWindow.once('ready-to-show', mainWindow.show);
  mainWindow.on('close', async e => {
    e.preventDefault();
    await logger
      .generateLogFile()
      .then(x => logger.log(`Log File: ${x}`, 'DEBUG'));
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
    mainWindow.destroy();
  });
  ipcMain.on('StateChange', (_event, state) => (runningTasks = state));
  ipcMain.on('log', (_event, data, type, meta) => logger.log(data, type, meta));
  ipcMain.on('debug', (_event, data) =>
    logger.log(
      data,
      'DEBUG',
      'RebornOS Fire Renderer',
      !(process.env.DEBUG || args.debug)
    )
  );
  if (process.env.NODE_ENV === 'production') {
    mainWindow.setMenu(null);
    return mainWindow.loadURL('app://./index.html');
  }
  mainWindow.loadURL(`http://localhost:${process.env.PORT}/`);
});

app.once('window-all-closed', app.quit);
