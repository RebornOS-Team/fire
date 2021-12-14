import {jwtVerify, importJWK} from 'jose';
import modules from './modules';
import {ipcRenderer} from 'electron';
import {centra} from '@nia3208/centra';

/**
 * @async
 * @function updater
 * @description used to check for updates
 * @author SoulHarsh007 <harsh.peshwani@outlook.com>
 * @copyright SoulHarsh007 2021
 * @since v1.0.0-rc.4
 * @returns {Promise<any>} - returns response promise
 */
export default async function updater() {
  const publicKey = await importJWK(
    {
      kty: process.env.PUBLIC_KEY_KTY,
      x: process.env.PUBLIC_KEY_X,
      y: process.env.PUBLIC_KEY_Y,
      crv: process.env.PUBLIC_KEY_CRV,
    },
    process.env.PUBLIC_KEY_ALG
  );
  ipcRenderer.send(
    'log',
    `Checking for updates at: ${process.env.FIRE_MODULES_SERVER}`,
    'INFO',
    'RebornOS Fire Renderer'
  );
  return centra(process.env.FIRE_MODULES_SERVER, 'GET')
    .json()
    .then(async res => {
      const {payload} = await jwtVerify(res.modules, publicKey, {
        algorithms: ['ES512'],
        audience: 'RebornOS Fire',
        issuer: 'RebornOS Fire Modules Server',
        subject: 'RebornOS Fire Modules',
      }).catch(e => {
        ipcRenderer.send(
          'log',
          'Error verifying JWT',
          'ERROR',
          'RebornOS Fire Renderer'
        );
        ipcRenderer.send('log', e, 'ERROR', 'RebornOS Fire Renderer');
      });
      ipcRenderer.send('debug', payload);
      if (payload.version !== modules.get('version')) {
        ipcRenderer.send(
          'log',
          `Got new modules package: ${payload.version} - ${payload.resourceTag}`,
          'INFO',
          'RebornOS Fire Renderer'
        );
        modules.set(payload);
        return true;
      }
      return false;
    });
}
