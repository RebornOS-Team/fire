const {performance} = require('perf_hooks');

module.exports = class StopWatch {
  /**
   * @class StopWatch
   * @author SoulHarsh007 <harshtheking@hotmail.com>
   * @copyright SoulHarsh007 2021
   * @since v1.0.0-Pre-Alpha
   * @class StopWatch
   * @description Used to measure time taken
   */
  constructor() {
    this._start = performance.now();
    this._end = null;
  }

  /**
   * @returns {number} - returns duration
   */
  get duration() {
    return this._end
      ? this._end - this._start
      : performance.now() - this._start;
  }

  /**
   * @returns {boolean} - returns true if running else false
   */
  get running() {
    return !this._end;
  }

  /**
   * @function restart
   * @returns {StopWatch} - returns restarted stopwatch instance
   */
  restart() {
    this._start = performance.now();
    this._end = null;
    return this;
  }

  /**
   * @function reset
   * @returns {StopWatch} - resets and returns stopwatch instance
   */
  reset() {
    this._start = performance.now();
    this._end = this._start;
    return this;
  }

  /**
   * @function start
   * @returns {StopWatch} - returns started stopwatch instance
   */
  start() {
    if (!this.running) {
      this._start = performance.now() - this.duration;
      this._end = null;
    }
    return this;
  }

  /**
   * @function stop
   * @returns {StopWatch} - returns stopped stopwatch instance
   */
  stop() {
    if (this.running) {
      this._end = performance.now();
    }
    return this;
  }

  /**
   * @function toString
   * @returns {string} - returns time elapsed in string format
   */
  toString() {
    if (this.duration >= 1000) {
      return `${(this.duration / 1000).toFixed(3)}s`;
    } else if (this.duration >= 1) {
      return `${this.duration.toFixed(3)}ms`;
    }
    return `${(this.duration * 1000).toFixed(3)}μs`;
  }
};
