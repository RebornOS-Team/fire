const terminal = require('node-pty');
const StopWatch = require('./stopwatch');
const privateBin = require('./privateBin');
const Logger = require('./logger');

module.exports = class LocalTerminalManager {
  /**
   * @author SoulHarsh007 <harsh.peshwani@outlook.com>
   * @copyright SoulHarsh007 2021
   * @since v1.0.0-rc.4
   * @param {string} pkg - Name of package being installed
   * @param {string[]} command - Command to execute
   * @param {Logger} mainProcessLogger - logger of main process, for shared log generation
   */
  constructor(pkg, command, mainProcessLogger) {
    this.startTs = new Date();
    this.stopwatch = new StopWatch();
    /**
     * @type {import('node-pty').IPty}
     * @description this jsdoc is a workaround to provide autocompletion for a spawned process without spawning it
     */
    this.terminal = terminal;
    this.logger = new Logger('RebornOS Fire Main');
    this.pkg = pkg;
    command.unshift('--disable-internal-agent');
    this.command = command;
    this.mainProcessLogger = mainProcessLogger;
  }

  /**
   * @function handleCommandExecution
   * @description handles command execution
   */
  handleCommandExecution() {
    this.log(`Package Working On: ${this.pkg}`, 'INFO');
    this.log(`Command Executed: ${this.command.join(' ')}`, 'INFO');
    this.log(`Start TimeStamp: ${this.startTs}`, 'INFO');
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
    this.stopwatch.start();
    this.terminal.onData(data => {
      process.stdout.write(data);
    });
    this.terminal.onExit(() => {
      this.stopwatch.stop();
      this.log(`Took Me: ${this.stopwatch.toString()}`, 'INFO');
      this.log(`End TimeStamp: ${new Date()}`, 'INFO');
    });
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
    this.mainProcessLogger.log(data, type, meta);
  }

  /**
   * @function generateLogs
   * @description generates log file and stores it to /tmp/RebornOS Fire <PKG NAME> <START TS>.log
   */
  generateLogs() {
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
      .then(fileName =>
        this.log(`Log file generated, can be found at: ${fileName}`, 'INFO')
      )
      .catch(e =>
        this.log(`Failed to generate logs, Error: ${e.stack}`, 'ERROR')
      );
  }

  /**
   * @async
   * @function privateBin
   * @returns {Promise<void>}
   */
  async privateBin() {
    return this.log(
      await privateBin(this.logger.rawLogs, (...args) => this.log(...args)),
      'INFO'
    );
  }
};
