const {randomUUID} = require('crypto');
const {version, codeName} = require('./package.json');
module.exports = {
  ...process.env,
  MODULES_KEY: randomUUID(),
  VERSION: version,
  CODE_NAME: codeName,
  FIRE_MODULES_SERVER: 'https://fire.rebornos.org/api/v1/modules',
  PUBLIC_KEY_X:
    'AIqky6WSMGLIw4bFwya91o0Y94M22F5hFKxHQfitdEYp6MvnXR7a5KMrXQmJlFMt8uPpVkxQAHe6ds4ciHr-XYVh',
  PUBLIC_KEY_Y:
    'AacZNFD4JHCoTSC504QoqvApPv9EQn-WJ98kZU4XaiPvovgrdXCDYxo1NAydgDWcSTr9DrCWCxGn17B0Nk8gdD62',
  PUBLIC_KEY_KTY: 'EC',
  PUBLIC_KEY_CRV: 'P-521',
  PUBLIC_KEY_ALG: 'ES512',
};
