const {writeFile} = require('fs/promises');
const {inspect} = require('util');

module.exports = class Logger {
  /**
   * @author SoulHarsh007 <harsh.peshwani@outlook.com>
   * @copyright SoulHarsh007 2021
   * @since v1.0.0-rc-02
   * @param {string} [defaultMeta] - Make this logger a store only logger
   * @class Logger
   * @classdesc prettifies, stores and then logs any data to console
   */
  constructor(defaultMeta) {
    this.logs = [];
    this.meta = defaultMeta;
  }

  /**
   * @function generateLogFile
   * @description generates log file and stores it to /tmp/RebornOS Fire <CURRENT TS>.log
   * @returns {Promise<string>} - Path to log file
   */
  generateLogFile() {
    const fileName = `/tmp/RebornOS Fire ${new Date()
      .toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
      })
      .replace(/,/g, '')}.log`;
    return writeFile(fileName, this.rawLogs)
      .then(() => fileName)
      .catch(e => e.stack || e);
  }

  /**
   * @function log
   * @param {string} [data] - log format param [date time `${meta}`] [`${type}`] - `${data}`
   * @param {string} [type] - log format param [date time `${meta}`] [`${type}`] - `${data}`
   * @param {any} [meta] - log format param [date time `${meta}`] [`${type}`] - `${data}`
   * @param {boolean} [silent] - if true, logger stores the log without logging to console
   * @description stores and logs data to console
   */
  log(data, type, meta, silent = false) {
    if (typeof data !== 'string') {
      data = inspect(data);
    }
    const log = `[${new Date()
      .toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
      })
      .replace(/,/g, '')} ${meta || this.meta}] [${type}] - ${data}`;
    this.logs.push(log);
    if (!silent) {
      console.log(log);
    }
  }

  /**
   * @function rawLogs
   * @returns {string} Raw logs
   * @description raw logs with RebornOS Fire header and footer appended
   */
  get rawLogs() {
    const logs = this.logs;
    logs.unshift(
      `========== RebornOS Fire v${process.env.VERSION} (${process.env.CODE_NAME}) Log File ==========\n`
    );
    logs.push(
      `\n========== RebornOS Fire v${process.env.VERSION} (${process.env.CODE_NAME}) Log File ==========\n`
    );
    return logs.join('\n');
  }

  /**
   * @function clearLogs
   * @param {boolean} [callGC] - call gc
   * @description clears all stored logs and optionally calls gc
   */
  clearLogs(callGC) {
    delete this.logs;
    this.logs = [];
    if (callGC) {
      global.gc();
    }
  }
};
