const {app, dialog, clipboard} = require('electron');
const Logger = require('./logger');

/**
 * @author SoulHarsh007 <harsh.peshwani@outlook.com>
 * @copyright SoulHarsh007 2021
 * @since v1.0.0-rc.4
 * @param {string} title - title of the error message
 * @param {Error} error - Error that was caught
 */
const handleException = (title, error) => {
  if (app.isReady()) {
    dialog
      .showMessageBox({
        type: 'error',
        buttons: ['Okay', 'Quit', 'Copy Error Stack'],
        defaultId: 0,
        message: title,
        detail: error.stack ?? error.message,
      })
      .then(res => {
        const crashLogger = new Logger(
          'RebornOS Fire Crash Reporter',
          app.getPath('crashDumps')
        );
        crashLogger.log(error.stack ?? error.message, 'Crash Log');
        crashLogger.generateLogFile();
        if (res.response === 2) {
          clipboard.writeText(error.stack ?? error.message);
        }
        if (res.response === 1) {
          app.quit();
        }
      });
  } else {
    dialog.showErrorBox(title, error.stack ?? error.message);
  }
};
process.on('uncaughtException', error =>
  handleException('RebornOS Fire ran into an error', error)
);
process.on('unhandledRejection', error =>
  handleException('RebornOS Fire ran into an error', error)
);
