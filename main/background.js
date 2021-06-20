import {app, BrowserWindow, dialog, ipcMain} from 'electron';
import serve from 'electron-serve';
import {join} from 'path';
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
    icon: join(__dirname, '/icon.png'),
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
  ipcMain.handle('StateChange', async (event, state) => {
    runningTasks = state;
    return state;
  });
  if (process.env.NODE_ENV === 'production') {
    mainWindow.setMenu(null);
    return mainWindow.loadURL('app://./index.html');
  }
  mainWindow.loadURL(`http://localhost:${process.argv[2]}/`);
});
app.once('window-all-closed', app.quit);
