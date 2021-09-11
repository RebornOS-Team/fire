/* eslint-disable jsdoc/valid-types */
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
 * @description Args parser
 * @returns {{[k: string]: string}} parsed args as object
 */
const argsProcessor = () => {
  const json = {};
  process.argv
    .slice(2)
    .join(' ')
    // The regex is safe, and the warning is likely a false positive!
    // eslint-disable-next-line security/detect-unsafe-regex
    .match(/-{1,2}(([/-z]+)(\s|=|-)?)+/g)
    ?.forEach(x => {
      const args = x.replace(/-(-)?/, '').trim().split(/\s|=/g);
      json[args.shift()] = argsParser(args);
    });
  return json;
};

module.exports = argsProcessor;
