const {ipcMain} = require('electron');
const privateBin = require('./privateBin');
const Logger = require('./logger');
const LocalTerminalManager = require('./localTerminal');

module.exports = class TerminalManager extends LocalTerminalManager {
  /**
   * @author SoulHarsh007 <harsh.peshwani@outlook.com>
   * @augments LocalTerminalManager
   * @copyright SoulHarsh007 2021
   * @since v1.0.0-Pre-Alpha
   * @param {import('electron').WebContents} webContents - webContents of the renderer window
   * @param {string} pkg - Name of package being installed
   * @param {string[]} command - Command to execute
   * @param {Logger} mainProcessLogger - logger of main process, for shared log generation
   */
  constructor(webContents, pkg, command, mainProcessLogger) {
    super(pkg, command, mainProcessLogger);
    this.webContents = webContents;
  }

  /**
   * @function handleCommandExecution
   * @description handles command execution
   * @override
   */
  handleCommandExecution() {
    this.removeAllListeners();
    this.log(`Package Working On: ${this.pkg}`, 'INFO');
    this.log(`Command Executed: ${this.command.join(' ')}`, 'INFO');
    this.log(`Start TimeStamp: ${this.startTs}`, 'INFO');
    this.webContents.send('termData', '\x1bc');
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
    this.webContents.send(
      'termData',
      `Process spawned with command: pkexec ${this.command.join(' ')}, PID: ${
        this.terminal.pid
      }\n`
    );
    this.stopwatch.start();
    ipcMain.on('termInput', (_, input) => {
      this.terminal.write(`${input}\r`);
    });
    this.terminal.onData(data => {
      this.webContents.send('termData', data);
      this.log(data, 'INFO', this.terminal.process);
    });
    this.terminal.onExit(data => {
      this.stopwatch.stop();
      this.webContents.send('termExit', {
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
   * @function generateLogs
   * @description generates log file and stores it to /tmp/RebornOS Fire <PKG NAME> <START TS>.log
   * @override
   */
  generateLogs() {
    super.generateLogs();
    this.logger
      .generateLogFile(
        `${this.pkg} ${this.startTs
          .toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
          })
          .replace(/,/g, '')}`
      )
      .then(fileName => this.webContents.send('logsGenerated', fileName))
      .catch(e => this.webContents.send('logsError', e.stack ?? e));
  }

  /**
   * @async
   * @function privateBin
   * @returns {Promise<void>}
   * @override
   */
  async privateBin() {
    return this.webContents.send(
      'privateBinRes',
      await privateBin(this.logger.rawLogs, (...args) => this.log(...args))
    );
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
