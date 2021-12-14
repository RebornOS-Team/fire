/* eslint-disable jsdoc/valid-types */
const {options} = require('./constants');

/**
 * @function argsParser
 * @author SoulHarsh007 <harsh.peshwani@outlook.com>
 * @copyright SoulHarsh007 2021
 * @since v1.0.0-rc-02
 * @description Args parser
 * @param {string[]} arg - Array containing process.argv
 * @returns {true | string | string[]} true if no args length, string if only 1 member in array, returns the array if more than 1 member
 */
const argsParser = arg => {
  if (!arg.length) {
    return true;
  }
  if (arg.length === 1) {
    return arg.shift();
  }
  return arg;
};

/**
 * @function argsProcessor
 * @author SoulHarsh007 <harsh.peshwani@outlook.com>
 * @copyright SoulHarsh007 2021
 * @since v1.0.0-rc-02
 * @description Args processor
 * @returns {{[k: string]: string}} Parsed KeyValue args
 */
const argsProcessor = () => {
  const args = {};
  const rawArgs = process.argv.slice(1);
  rawArgs
    .filter(x => !x.startsWith('rebornos-fire://'))
    .join(' ')
    // The regex is safe, and the warning is likely a false positive!
    // eslint-disable-next-line security/detect-unsafe-regex
    .match(/-{1,2}(([/-z]+)(\s|=|-)?)+/g)
    ?.forEach(x => {
      const argString = x.replace(/-(-)?/, '').trim().split(/\s|=/g);
      const key = argString.shift();
      const alias = options.find(cmd => cmd.aliases.includes(key));
      if (alias) {
        args[alias.name] = argsParser(argString);
      } else {
        // eslint-disable-next-line security/detect-object-injection
        args[key] = argsParser(argString);
      }
    });
  if (rawArgs.join(' ').startsWith('rebornos-fire://')) {
    args.page = rawArgs.join(' ').replace('rebornos-fire://', '');
  }
  return args;
};

module.exports = argsProcessor;
