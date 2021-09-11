const {ipcMain} = require('electron');
const terminal = require('node-pty');
const StopWatch = require('./stopwatch');
const {writeFile} = require('fs/promises');
const privateBin = require('./privateBin');
const Logger = require('./logger');

module.exports = class TerminalManager {
  /**
   * @author SoulHarsh007 <harsh.peshwani@outlook.com>
   * @copyright SoulHarsh007 2021
   * @since v1.0.0-Pre-Alpha
   * @param {import('electron').BrowserWindow} mainWindow - Main renderer window
   * @param {string} pkg - Name of package being installed
   * @param {string[]} command - Command to execute
   */
  constructor(mainWindow, pkg, command) {
    this.mainWindow = mainWindow;
    this.startTs = new Date();
    this.stopwatch = new StopWatch();
    /**
     * @type {import('node-pty').IPty}
     * @description this jsdoc is a workaround to provide autocompletion for a spawned process without spawning it
     */
    this.terminal = terminal;
    this.logger = new Logger('RebornOS Fire Main');
    this.pkg = pkg;
    this.command = command;
  }

  /**
   * @function handleCommandExecution
   * @description handles command execution
   */
  handleCommandExecution() {
    this.removeAllListeners();
    this.log(`Package Working On: ${this.pkg}`, 'INFO');
    this.log(`Command Executed: ${this.command.join(' ')}`, 'INFO');
    this.log(`Start TimeStamp: ${this.startTs}`, 'INFO');
    this.mainWindow.webContents.send('termData', '\x1bc');
    this.terminal = this.terminal.spawn('pkexec', this.command, {
      name: 'xterm-color',
      env: process.env,
      cols: 110,
      rows: 28,
    });
    this.log(
      `Process spawned with command: pkexec ${this.command.join(' ')}, PID: ${
        this.terminal.pid
      }`,
      'INFO'
    );
    this.mainWindow.webContents.send(
      'termData',
      `Process spawned with command: pkexec ${this.command.join(' ')}, PID: ${
        this.terminal.pid
      }\n`
    );
    this.stopwatch.start();
    this.terminal.onData(data => {
      this.mainWindow.webContents.send('termData', data);
      this.log(data, 'INFO', this.terminal.process);
    });
    this.terminal.onExit(data => {
      this.stopwatch.stop();
      this.mainWindow.webContents.send('termExit', {
        ...data,
        time: this.stopwatch.toString(),
      });
      this.log(`Took Me: ${this.stopwatch.toString()}`, 'INFO');
      this.log(`End TimeStamp: ${new Date()}`, 'INFO');
    });
  }

  /**
   * @function resizeTerminal
   * @param {number} cols - number of columns
   * @param {number} rows - number of rows
   * @description resizes terminal
   */
  resizeTerminal(cols, rows) {
    this.terminal.resize(cols, rows);
  }

  /**
   * @function log
   * @param {string} [data] - log format param [date time `${meta}`] [`${type}`] - `${data}`
   * @param {string} [type] - log format param [date time `${meta}`] [`${type}`] - `${data}`
   * @param {any} [meta] - log format param [date time `${meta}`] [`${type}`] - `${data}`
   * @description wrapper around <Logger>.log. logs data in main process console and stores it
   */
  log(data, type, meta) {
    this.logger.log(data, type, meta, true);
    ipcMain.emit('log', {}, data, type, meta);
  }

  /**
   * @function generateLogs
   * @description generates log file and stores it to /tmp/RebornOS Fire <PKG NAME> <START TS>.log
   */
  generateLogs() {
    const fileName = `/tmp/RebornOS Fire ${this.pkg} ${this.startTs
      .toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
      })
      .replace(/,/g, '')}.log`;
    writeFile(fileName, this.logger.rawLogs)
      .then(() => this.mainWindow.webContents.send('logsGenerated', fileName))
      .catch(e => this.mainWindow.webContents.send('logsError', e.stack || e));
  }

  /**
   * @async
   * @function privateBin
   * @returns {void}
   */
  async privateBin() {
    const data = await privateBin(this.logger.rawLogs);
    if (data.message) {
      return this.mainWindow.webContents.send('privateBinRes', {
        error: data.message,
      });
    }
    this.mainWindow.webContents.send('privateBinRes', data);
  }

  /**
   * @function removeAllListeners
   * @description used to remove all event listeners from ipcMain
   */
  removeAllListeners() {
    ipcMain.removeAllListeners('generateLogs');
    ipcMain.removeAllListeners('privateBin');
    ipcMain.removeAllListeners('termResize');
  }
};
