const {app, BrowserWindow, dialog, ipcMain} = require('electron');
const serve = require('electron-serve');
const {spawn} = require('node-pty');
const StopWatch = require('./stopwatch');

let runningTasks = false;
process.env.NODE_ENV === 'production'
  ? serve({
      directory: 'app',
    })
  : app.setPath('userData', `${app.getPath('userData')} (development)`);
app.whenReady().then(() => {
  ipcMain.on('termExec', (_event, command) => {
    mainWindow.webContents.send('termData', '\x1bc');
    const stopwatch = new StopWatch();
    stopwatch.start();
    const term = spawn('pkexec', command, {
      name: 'xterm-color',
      env: process.env,
      rows: 30,
    });
    mainWindow.webContents.send(
      'termData',
      `Process spawned with command: pkexec ${command.join(' ')}, PID: ${
        term.pid
      }\n`
    );
    ipcMain.on('termKill', () => term.kill('SIGTERM'));
    ipcMain.on('termResize', (_event, cols, rows) => term.resize(cols, rows));
    term.onData(data => mainWindow.webContents.send('termData', data));
    term.onExit(data => {
      stopwatch.stop();
      mainWindow.webContents.send('termExit', {
        ...data,
        time: stopwatch.toString(),
      });
      ipcMain.removeAllListeners('termKill');
      ipcMain.removeAllListeners('termResize');
    });
  });
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
  mainWindow.once('ready-to-show', mainWindow.show);
  mainWindow.on('close', e => {
    if (runningTasks) {
      e.preventDefault();
      const choice = dialog.showMessageBoxSync(mainWindow, {
        type: 'question',
        buttons: ['Yes', 'No'],
        title: 'Warning: Active Tasks',
        message: 'There are tasks running, are you sure you want to exit?',
      });
      if (!choice) {
        mainWindow.destroy();
      }
    }
  });
  ipcMain.handle('StateChange', (_event, state) => (runningTasks = state));
  if (process.env.NODE_ENV === 'production') {
    mainWindow.setMenu(null);
    return mainWindow.loadURL('app://./index.html');
  }
  mainWindow.loadURL(`http://localhost:${process.env.PORT}/`);
});
app.once('window-all-closed', app.quit);
