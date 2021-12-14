if (process.getgid() === 0) {
  console.log(
    'Error: Running FIRE as root is not permitted, This instance will exit now.'
  );
  process.exit(1);
}
const {app, BrowserWindow, dialog} = require('electron');
const serve = require('electron-serve');
process.env.NODE_ENV === 'production'
  ? serve({
      directory: 'app',
      scheme: 'rebornos-fire',
    })
  : app.setPath('userData', `${app.getPath('userData')} (development)`);
require('./crashHandler');
const ipcManager = require('./ipcManager');
const Logger = require('./logger');
const ArgsHandler = require('./argsHandler');
const logger = new Logger('RebornOS Fire Main');
require('./configManager')(logger);
const argsHandler = new ArgsHandler(logger);
argsHandler.execute();

app.setAsDefaultProtocolClient('rebornos-fire');
app.whenReady().then(() => {
  if (argsHandler.blockMainThread) {
    return;
  }
  const mainWindow = new BrowserWindow({
    minHeight: 600,
    minWidth: 800,
    icon: 'rebornos-fire://./icon.png',
    show: false,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      nativeWindowOpen: true,
      devTools: process.env.NODE_ENV !== 'production',
    },
  });
  ipcManager(mainWindow, logger);
  if (!app.requestSingleInstanceLock()) {
    logger.log(
      'Another instance of RebornOS Fire is running, Quitting...',
      'ERROR'
    );
    dialog.showErrorBox(
      'Active Process Detected',
      'Another instance of RebornOS Fire is already running, This instance will now quit'
    );
    app.quit();
  } else {
    app.on('second-instance', () => {
      logger.log(
        'Detected another instance of RebornOS Fire, You should avoid running multiple instances of RebornOS Fire',
        'WARN'
      );
      if (mainWindow.isMinimized()) {
        mainWindow.restore();
      }
      mainWindow.focus();
    });
  }
  mainWindow.once('ready-to-show', () => mainWindow.show());
  mainWindow.webContents.on('before-input-event', (event, input) => {
    if (input.control && input.key.toLowerCase() === 'r') {
      event.preventDefault();
      app.relaunch();
      app.quit();
    } else if (input.control && input.key.toLowerCase() === 'q') {
      event.preventDefault();
      app.quit();
    }
  });
  if (process.env.NODE_ENV === 'production') {
    mainWindow.setMenu(null);
    return mainWindow.loadURL('rebornos-fire://./index.html');
  }
  mainWindow.loadURL(`http://localhost:${process.env.PORT}/`);
});
app.once('window-all-closed', () => app.quit());
