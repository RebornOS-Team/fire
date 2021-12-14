const {centra} = require('@nia3208/centra');
const {importJWK, jwtVerify} = require('jose');
const config = require('./config');
const argsProcessor = require('./argsParser');
const modules = require('./modules');
const {options, keys} = require('./constants');

/**
 * @class ArgsHandler
 * @author SoulHarsh007 <harsh.peshwani@outlook.com>
 * @copyright SoulHarsh007 2021
 * @since v1.0.0-rc.4
 * @description handles process according to args
 */
class ArgsHandler {
  /**
   * @class ArgsHandler
   * @author SoulHarsh007 <harsh.peshwani@outlook.com>
   * @copyright SoulHarsh007 2021
   * @since v1.0.0-rc.4
   * @description handles process according to args
   * @param {import('./logger')} logger - logger instance to use for logging
   */
  constructor(logger) {
    this.logger = logger;
    this.args = argsProcessor();
    this.blockMainThread = !!Object.keys(this.args).filter(x =>
      ['help', 'config', 'version', 'update'].includes(x)
    ).length;
  }

  /**
   * @function doHelp
   * @description executes the help command
   */
  doHelp() {
    const menu = options
      .map(
        x =>
          `${`${x.aliases.map(y => `-${y}`).join(', ')}, --${x.name}`.padEnd(
            45,
            ' '
          )}${x.description}\n`
      )
      .join('  ');
    console.log(
      `RebornOS Fire - ${process.env.VERSION} (${process.env.CODE_NAME})

Usage: rebornos-fire [options]

Pages: ${Object.keys(keys).join(', ')}

Options:
  ${menu}`
    );
    process.exit(0);
  }

  /**
   * @function doVersion
   * @description executes the version command
   */
  doVersion() {
    console.log(
      `RebornOS Fire - ${process.env.VERSION} (${process.env.CODE_NAME})`
    );
    process.exit(0);
  }

  /**
   * @function doConfig
   * @description executes the config command
   */
  doConfig() {
    console.log(
      `Active config:\n${Object.keys(config.store)
        .map(
          x =>
            `  ${x}:\n${Object.keys(config.get(x))
              .map(y => `    ${y}: ${config.get(`${x}.${y}`)}`)
              .join('\n')}`
        )
        .join('\n')}`
    );
    process.exit(0);
  }

  /**
   * @async
   * @function doUpdate
   * @description executes the update command
   */
  async doUpdate() {
    console.log(
      `Active modules identifier: ${modules.get('resourceTag')}-${modules.get(
        'version'
      )}-${modules.get('uploader')}`
    );
    const publicKey = await importJWK(
      {
        kty: process.env.PUBLIC_KEY_KTY,
        x: process.env.PUBLIC_KEY_X,
        y: process.env.PUBLIC_KEY_Y,
        crv: process.env.PUBLIC_KEY_CRV,
      },
      process.env.PUBLIC_KEY_ALG
    );
    console.log(`Checking for updates at: ${process.env.FIRE_MODULES_SERVER}`);
    try {
      const res = await centra(process.env.FIRE_MODULES_SERVER, 'GET').json();
      const {payload} = await jwtVerify(res.modules, publicKey, {
        algorithms: ['ES512'],
        audience: 'RebornOS Fire',
        issuer: 'RebornOS Fire Modules Server',
        subject: 'RebornOS Fire Modules',
      }).catch(e => {
        console.log('Error verifying JWT');
        console.log(e);
      });
      if (payload.version !== modules.get('version')) {
        console.log(
          `Updated modules package: ${payload.version}-${payload.resourceTag}-${payload.uploader}`
        );
        modules.set(payload);
        console.log(`Modules package updated successfully`);
      } else {
        console.log('Modules are upto date');
      }
    } catch (e) {
      console.log(`Error: ${e.stack}`);
    }
    process.exit(0);
  }

  /**
   * @function execute
   * @description executes args handling
   * @returns {void}
   */
  execute() {
    if (this.args.help) {
      return this.doHelp();
    } else if (this.args.config) {
      return this.doConfig();
    } else if (this.args.version) {
      return this.doVersion();
    } else if (this.args.update) {
      return this.doUpdate();
    }
    this.logger.log(`Start TimeStamp: ${new Date()}`, 'INFO');
    if (process.env.DEBUG || this.args.debug) {
      this.logger.log(`Raw Args: ${process.argv.slice(1)}`, 'DEBUG');
    }
    this.logger.log(`Spawn Args: ${JSON.stringify(this.args)}`, 'INFO');
  }
}

module.exports = ArgsHandler;
