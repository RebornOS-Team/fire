const {centra} = require('@nia3208/centra');
const crypto = require('crypto');
const zlib = require('zlib');
const {encode} = require('bs58');
const config = require('./config');

/**
 * @function sendRequest
 * @description sends request to specified url with specified data
 * @author SoulHarsh007 <harsh.peshwani@outlook.com>
 * @copyright SoulHarsh007 2021
 * @since v1.0.0-Pre-Alpha
 * @param {string} url - The url to send request at
 * @param {any} data - The data to post
 * @returns {Promise<{url: string, data: {status: number, id?: string, url?: string, deletetoken?: string, message?: string}}>} Response from the server
 */
async function sendRequest(url, data) {
  const req = centra(url, 'POST')
    .header({
      'Content-Type': 'application/json',
      'X-Requested-With': 'JSONHttpRequest',
    })
    .body(data, 'json');
  return {
    url: req.url,
    data: await req.json(),
  };
}

/**
 * @function handlePaste
 * @description encrypts data before it's sent to privatebin instances
 * @author SoulHarsh007 <harsh.peshwani@outlook.com>
 * @copyright SoulHarsh007 2021
 * @since v1.0.0-Pre-Alpha
 * @param {string} paste - The data to send / paste
 * @param {Function} log - The logger function to use for logging
 * @returns {Promise<{url?: string, deleteToken?: string, message?: string, errors?: {primary?: Error, fallback?: Error}}>} decryption key, delete token, and the url
 */
async function handlePaste(paste, log) {
  const iv = crypto.randomBytes(16);
  const salt = crypto.randomBytes(8);
  const key = crypto.randomBytes(32);
  const cipher = crypto.createCipheriv(
    'aes-256-gcm',
    crypto.pbkdf2Sync(key, salt, 100000, 32, 'sha256'),
    iv
  );
  const data = [
    [
      iv.toString('base64'),
      salt.toString('base64'),
      100000,
      256,
      128,
      'aes',
      'gcm',
      'zlib',
    ],
    'plaintext',
    0,
    0,
  ];
  cipher.setAAD(Buffer.from(JSON.stringify(data), 'utf-8'));
  const cipherText = Buffer.concat([
    cipher.update(
      Buffer.from(
        zlib.deflateRawSync(
          new Uint8Array(
            Buffer.from(
              JSON.stringify({
                paste,
              }),
              'utf8'
            )
          )
        )
      )
    ),
    cipher.final(),
    cipher.getAuthTag(),
  ]);
  const requestData = {
    v: 2,
    ct: cipherText.toString('base64'),
    adata: data,
    meta: {
      expire: '1week',
    },
  };
  let res;
  let primary;
  try {
    res = await sendRequest(
      config.get('privateBin.primaryServer'),
      requestData
    );
    if (res.data.status) {
      throw new Error(res.data.message);
    }
  } catch (e) {
    log(e, 'ERROR', 'PrivateBin');
    log(
      'Falling back to fallback server, Primary server returned an error',
      'INFO',
      'PrivateBin'
    );
    try {
      res = await sendRequest(
        config.get('privateBin.fallbackServer'),
        requestData
      );
      primary = e.message;
      if (res.data.status) {
        throw new Error(res.data.message);
      }
    } catch (error) {
      log(error, 'ERROR', 'PrivateBin');
      log(
        'Failed to create a privatebin paste, Both servers returned an error',
        'INFO',
        'PrivateBin'
      );
      return {
        errors: {
          primary: e.message,
          fallback: error.message,
        },
        ...res.data,
      };
    }
  }
  return {
    url: `${res.url}?${res.data.id}#${encode(key)}`,
    deleteToken: res.data.deletetoken,
    errors: {
      primary: primary,
    },
  };
}
module.exports = handlePaste;
