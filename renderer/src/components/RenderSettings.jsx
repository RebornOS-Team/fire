import {ipcRenderer} from 'electron';
import {resolve} from 'path';
import Panel from 'rsuite/Panel';
import FlexboxGrid from 'rsuite/FlexboxGrid';
import Divider from 'rsuite/Divider';
import Navbar from 'rsuite/Navbar';
import Nav from 'rsuite/Nav';
import InputGroup from 'rsuite/InputGroup';
import Input from 'rsuite/Input';
import Loader from 'rsuite/Loader';
import Tooltip from 'rsuite/Tooltip';
import Whisper from 'rsuite/Whisper';
import toaster from 'rsuite/toaster';
import Message from 'rsuite/Message';
import Button from 'rsuite/Button';
import TrashIcon from '@rsuite/icons/Trash';
import ReloadIcon from '@rsuite/icons/Reload';
import LegacySaveIcon from '@rsuite/icons/legacy/Save';
import LegacyFolderOpenOIcon from '@rsuite/icons/legacy/FolderOpenO';
import React, {useState, useEffect, useCallback} from 'react';
import isURL from 'validator/es/lib/isURL';
import modules from '../utils/modules';
import updater from '../utils/updater';

/**
 * @typedef {{privateBin: {primaryServer: string, fallbackServer: string}, logs: {path: string}}} FireConfig
 */

/**
 * @function SettingsComponent
 * @description manages settings / configuration for FIRE
 * @author SoulHarsh007 <harsh.peshwani@outlook.com>
 * @copyright SoulHarsh007 2021
 * @since v1.0.0-rc.4
 * @returns {any} - JSX body
 */
export default function SettingsComponent() {
  const [reload, setReload] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [configError, setConfigError] = useState(false);
  const [urlError, setUrlError] = useState({primary: false, fallback: false});
  const [moduleStatus, setModuleStatus] = useState('');
  /**
   * @type {[FireConfig, React.Dispatch<React.SetStateAction<FireConfig>>]}
   */
  const [config, setConfig] = useState();
  useEffect(() => {
    ipcRenderer.invoke('config').then(x => setConfig(x));
  }, [reload]);
  const doReset = useCallback(() => {
    setConfig(null);
    setReload(x => !x);
    setUrlError({primary: false, fallback: false});
    setConfigError(false);
  }, []);
  return (
    <>
      <Panel
        style={{
          textAlign: 'center',
        }}
        header={<h3>Settings</h3>}
        bodyFill
      />
      <Navbar appearance="subtle">
        <Nav pullRight appearance="subtle">
          <Nav.Item
            icon={<ReloadIcon />}
            eventKey="1"
            onClick={() => doReset()}
            active
          >
            {' Reload'}
          </Nav.Item>
          <Nav.Item
            icon={<TrashIcon />}
            eventKey="2"
            onSelect={() => {
              ipcRenderer.invoke('config-reset').then(() => doReset());
            }}
            active
          >
            {' Reset'}
          </Nav.Item>
          <Nav.Item
            icon={<LegacySaveIcon />}
            eventKey="3"
            onSelect={() => {
              if (!configError) {
                return ipcRenderer
                  .invoke('config-delete', 'logs.originalPath')
                  .then(() => {
                    ipcRenderer
                      .invoke('config-delete', 'logsError')
                      .then(() => {
                        ipcRenderer
                          .invoke('config-delete', 'error')
                          .then(() => {
                            ipcRenderer
                              .invoke(
                                'config-set',
                                'logs.path',
                                resolve(config.logs.path)
                              )
                              .then(() => {
                                ipcRenderer.invoke(
                                  'config-set',
                                  'privateBin.primaryServer',
                                  config.privateBin.primaryServer.replace(
                                    /\/+$/g,
                                    ''
                                  )
                                );
                              })
                              .then(() => {
                                ipcRenderer.invoke(
                                  'config-set',
                                  'privateBin.fallbackServer',
                                  config.privateBin.fallbackServer.replace(
                                    /\/+$/g,
                                    ''
                                  )
                                );
                              });
                          });
                      });
                  })
                  .then(() => {
                    setConfig(null);
                    setReload(x => !x);
                    toaster.push(
                      <Message
                        type="success"
                        showIcon
                        closable
                      >{`Configuration updated successfully!`}</Message>
                    );
                  });
              }
              return toaster.push(
                <Message
                  type="error"
                  showIcon
                  closable
                >{`There are errors in the configuration, cannot save with errors.`}</Message>
              );
            }}
            active
          >
            {' Save'}
          </Nav.Item>
        </Nav>
      </Navbar>
      <Divider />
      {config ? (
        <>
          <Divider>Private Bin</Divider>
          <FlexboxGrid
            justify="space-between"
            style={{
              paddingLeft: '20px',
              paddingRight: '30px',
            }}
          >
            <FlexboxGrid.Item>
              <h4>Primary Server:</h4>
            </FlexboxGrid.Item>
            <FlexboxGrid.Item>
              <Input
                spellCheck={false}
                placeholder="Primary Server URI"
                defaultValue={config.privateBin.primaryServer}
                style={{width: 298}}
                onChange={newValue => {
                  if (
                    !isURL(`${newValue}`, {
                      require_valid_protocol: true,
                      allow_trailing_dot: false,
                      protocols: ['http', 'https'],
                      validate_length: true,
                    })
                  ) {
                    setUrlError(x => ({primary: true, fallback: x.fallback}));
                    return setConfigError(true);
                  }
                  if (urlError.primary) {
                    setUrlError(x => ({primary: false, fallback: x.fallback}));
                    setConfigError(false);
                  }
                  setConfig(x => {
                    x.privateBin.primaryServer = newValue;
                    return x;
                  });
                }}
              />
              <p
                style={{
                  color: 'red',
                  display: urlError.primary ? 'flex' : 'none',
                }}
              >
                Invalid URL!
              </p>
            </FlexboxGrid.Item>
          </FlexboxGrid>
          <FlexboxGrid
            justify="space-between"
            style={{
              paddingLeft: '20px',
              paddingRight: '30px',
            }}
          >
            <FlexboxGrid.Item>
              <h4>Fallback Server:</h4>
            </FlexboxGrid.Item>
            <FlexboxGrid.Item>
              <Input
                spellCheck={false}
                placeholder="Fallback Server URI"
                defaultValue={config.privateBin.fallbackServer}
                style={{width: 298}}
                onChange={newValue => {
                  if (
                    !isURL(`${newValue}`, {
                      require_valid_protocol: true,
                      allow_trailing_dot: false,
                      protocols: ['http', 'https'],
                      validate_length: true,
                    })
                  ) {
                    setUrlError(x => ({fallback: true, primary: x.primary}));
                    return setConfigError(true);
                  }
                  if (urlError.fallback) {
                    setUrlError(x => ({fallback: false, primary: x.primary}));
                    setConfigError(false);
                  }
                  setConfig(x => {
                    x.privateBin.fallbackServer = newValue;
                    return x;
                  });
                }}
              />
              <p
                style={{
                  color: 'red',
                  display: urlError.fallback ? 'flex' : 'none',
                }}
              >
                Invalid URL!
              </p>
            </FlexboxGrid.Item>
          </FlexboxGrid>
          <Divider>Logs</Divider>
          <FlexboxGrid
            justify="space-between"
            style={{
              paddingLeft: '20px',
              paddingRight: '30px',
            }}
          >
            <FlexboxGrid.Item>
              <h4>Logs Storage Path:</h4>
            </FlexboxGrid.Item>
            <FlexboxGrid.Item>
              <InputGroup
                style={{
                  width: 300,
                  marginBottom: 10,
                }}
              >
                <Input
                  placeholder="Logs Path"
                  id="logs"
                  defaultValue={config.logs.originalPath ?? config.logs.path}
                  onChange={newValue => {
                    setConfig(x => {
                      x.logs.path = newValue;
                      return x;
                    });
                  }}
                  spellCheck={false}
                />
                <Whisper
                  placement="top"
                  trigger="hover"
                  speaker={<Tooltip>Select Folder</Tooltip>}
                >
                  <InputGroup.Button
                    onClick={() => {
                      ipcRenderer.invoke('showLogPathSelector').then(x => {
                        if (!x.cancelled) {
                          document.getElementById('logs').value =
                            x.filePaths?.[0];
                          setConfig(y => {
                            y.logs.path = x.filePaths?.[0];
                            return y;
                          });
                        }
                      });
                    }}
                  >
                    <LegacyFolderOpenOIcon />
                  </InputGroup.Button>
                </Whisper>
              </InputGroup>
            </FlexboxGrid.Item>
          </FlexboxGrid>
          <Divider>Configuration Modules</Divider>
          <FlexboxGrid
            justify="space-between"
            style={{
              paddingLeft: '20px',
              paddingRight: '30px',
            }}
          >
            <FlexboxGrid.Item>
              <h6>Modules ID:</h6>
            </FlexboxGrid.Item>
            <FlexboxGrid.Item>
              <h6>
                {modules.get('resourceTag')}-{modules.get('version')}-
                {modules.get('uploader')}
              </h6>
            </FlexboxGrid.Item>
          </FlexboxGrid>
          <FlexboxGrid
            justify="center"
            style={{
              paddingLeft: '20px',
              paddingRight: '30px',
            }}
          >
            <FlexboxGrid.Item>
              <Button
                color="blue"
                appearance="primary"
                disabled={updating}
                onClick={() => {
                  setUpdating(true);
                  setModuleStatus(
                    `Looking for module updates at: ${process.env.FIRE_MODULES_SERVER}`
                  );
                  updater()
                    .then(status => {
                      setUpdating(false);
                      setModuleStatus(
                        status
                          ? `Modules updated to v${modules.get('version')}`
                          : 'Modules are upto date!'
                      );
                    })
                    .catch(e => {
                      setUpdating(false);
                      setModuleStatus(
                        `Error while looking for updates: ${e.message}`
                      );
                      ipcRenderer.send('debug', e);
                    });
                }}
              >
                Check for updates
              </Button>
            </FlexboxGrid.Item>
          </FlexboxGrid>
          <FlexboxGrid
            justify="center"
            style={{
              paddingTop: '10px',
              paddingLeft: '20px',
              paddingRight: '30px',
            }}
          >
            <FlexboxGrid.Item>{moduleStatus}</FlexboxGrid.Item>
          </FlexboxGrid>
        </>
      ) : (
        <Loader
          speed="fast"
          vertical
          center
          backdrop
          content="Reading RebornOS Fire Configuration..."
          size="lg"
        />
      )}
    </>
  );
}
