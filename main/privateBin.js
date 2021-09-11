const {centra} = require('@nia3208/centra');
const crypto = require('crypto');
const {encode} = require('bs58');
const {ipcMain} = require('electron');

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
const sendRequest = async (url, data) => {
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
};

/**
 * @function
 * @description encrypts data before it's sent to privatebin instances
 * @author SoulHarsh007 <harsh.peshwani@outlook.com>
 * @copyright SoulHarsh007 2021
 * @since v1.0.0-Pre-Alpha
 * @param {string} paste - The data to send / paste
 * @returns {Promise<{url?: string, deleteToken?: string, message?: string}>} decryption key, delete token, and the url
 */
module.exports = async paste => {
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
      'none',
    ],
    'plaintext',
    0,
    0,
  ];
  cipher.setAAD(Buffer.from(JSON.stringify(data), 'utf-8'));
  const cipherText = Buffer.concat([
    cipher.update(
      Buffer.from(
        JSON.stringify({
          paste,
        }),
        'utf8'
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
  try {
    res = await sendRequest('https://paste.rebornos.org', requestData);
    if (res.data.status) {
      throw new Error(res.data.message);
    }
  } catch (e) {
    ipcMain.emit('log', (e, 'ERROR', 'PrivateBin'));
    res = await sendRequest('https://bin.byreqz.de', requestData);
  }
  if (res.data.status) {
    return {
      message: res.data.message,
    };
  }
  return {
    url: `${res.url}?${res.data.id}#${encode(key)}`,
    deleteToken: res.data.deletetoken,
  };
};
