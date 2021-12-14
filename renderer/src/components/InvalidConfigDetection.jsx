import {ipcRenderer} from 'electron';
import React, {useEffect, useState} from 'react';
import Button from 'rsuite/Button';
import Message from 'rsuite/Message';

/**
 * @function InvalidConfigDetection
 * @author SoulHarsh007 <harsh.peshwani@outlook.com>
 * @copyright SoulHarsh007 2021
 * @since v1.0.0-rc.4
 * @description Used for detecting invalid configuration
 * @returns {import('react').JSXElementConstructor} - React Body
 */
export default function InvalidConfigDetection() {
  const [errors, setErrors] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [fixMsg, setFixMsg] = useState('');
  const [reload, setReload] = useState(false);
  useEffect(() => {
    ipcRenderer.invoke('config-error').then(x => {
      if (x.length) {
        setErrors(x);
        setErrorMsg(
          `RebornOS FIRE threw this error while validating configuration: ${x[0].code}: ${x[0].description}, RebornOS FIRE has loaded the default configuration as a failsafe.`
        );
        switch (x[0].code) {
          case 'CONFIG_ERROR':
            setFixMsg('Reset Configuration');
            break;
          case 'INVALID_LOG_PATH':
            setFixMsg('Reset Logs Configuration');
            break;
          case 'INVALID_SCHEMA':
            setFixMsg('Reset Configuration');
            break;
          case 'INVALID_URL':
            setFixMsg('Reset PrivateBin Configuration');
            break;
          default:
            setFixMsg('Reset Configuration');
            break;
        }
      }
    });
  }, [reload]);
  return (
    <Message
      showIcon
      type="error"
      header="Configuration Error"
      closable
      style={{
        display: errors.length ? 'inline-block' : 'none',
      }}
    >
      {errorMsg}
      <span style={{display: 'flex', justifyContent: 'flex-end'}}>
        <Button
          onClick={() => {
            switch (fixMsg) {
              case 'Reset Configuration':
                ipcRenderer.invoke('config-reset');
                ipcRenderer.invoke('config-error-fix');
                break;
              case 'Reset PrivateBin Configuration':
                ipcRenderer
                  .invoke(
                    'config-set',
                    'privateBin.primaryServer',
                    'https://paste.rebornos.org'
                  )
                  .then(() => {
                    ipcRenderer.invoke(
                      'config-set',
                      'privateBin.fallbackServer',
                      'https://bin.byreqz.de'
                    );
                  });
                break;
              case 'Reset Logs Configuration':
                ipcRenderer.invoke('config-set', 'logs.path', '/tmp');
                break;
              default:
                ipcRenderer.invoke('config-reset');
                break;
            }
            setErrors([]);
            setReload(x => !x);
          }}
        >
          {fixMsg}
        </Button>
      </span>
    </Message>
  );
}
