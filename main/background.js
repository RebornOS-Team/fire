import {app, BrowserWindow} from 'electron';
import serve from 'electron-serve';

process.env.NODE_ENV === 'production'
  ? serve({
      directory: 'app',
    })
  : app.setPath('userData', `${app.getPath('userData')} (development)`);
(async () => {
  await app.whenReady();
  const mainWindow = new BrowserWindow({
    width: 1000,
    height: 600,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  process.env.NODE_ENV === 'production' ? mainWindow.setMenu(null) : undefined;
  process.env.NODE_ENV === 'production'
    ? await mainWindow.loadURL('app://./index.html')
    : await mainWindow.loadURL(`http://localhost:${process.argv[2]}/`);
})();
app.on('window-all-closed', app.quit);
