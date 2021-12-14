/* Not affected by this as all accessor variables are strings */
/* eslint-disable security/detect-object-injection */
import Panel from 'rsuite/Panel';
import FlexboxGrid from 'rsuite/FlexboxGrid';
import Divider from 'rsuite/Divider';
import toaster from 'rsuite/toaster';
import Message from 'rsuite/Message';
import Toggle from 'rsuite/Toggle';
import InputNumber from 'rsuite/InputNumber';
import InputGroup from 'rsuite/InputGroup';
import LegacyCheckIcon from '@rsuite/icons/legacy/Check';
import LegacyCloseIcon from '@rsuite/icons/legacy/Close';
import React, {useCallback, useEffect, useState, useMemo} from 'react';
import {ipcRenderer} from 'electron';
import {access, readFile, writeFile} from 'fs/promises';
import {cpus} from 'os';
import ReloadBar from './ReloadBar';

/**
 * @function RenderTweaks
 * @author SoulHarsh007 <harsh.peshwani@outlook.com>
 * @copyright SoulHarsh007 2021
 * @since v1.0.0-Pre-Alpha
 * @description Used for rendering System Management
 * @returns {import('react').JSXElementConstructor} React Body
 */
export default function RenderTweaks() {
  const pacmanRegex = useMemo(
    () => /^(?!#.*$)([ \t])*ParallelDownloads\s*=\s*\d*/gm,
    []
  );
  const makepkgRegex = useMemo(
    () => /^(?!#.*$)([ \t])*MAKEFLAGS\s*=\s*".+?"/gm,
    []
  );
  const [downloads, setDownloads] = useState(5);
  const [conf, setConf] = useState({
    pacman: {
      enabled: false,
    },
    makepkg: {
      enabled: false,
    },
  });
  const [refresh, setRefresh] = useState({
    loading: true,
    text: 'Reloading',
  });
  const handleToggle = useCallback(
    /**
     * @author SoulHarsh007 <harsh.peshwani@outlook.com>
     * @async
     * @copyright SoulHarsh007 2021
     * @since v1.0.0-rc-003
     * @param {'pacman' | 'makepkg'} file - file name we are working on
     * @param {string} value - new value to set in file
     * @param {RegExp} regex - RegExp to use for matching file content
     * @returns {Promise<void>}
     */
    async (file, value, regex) => {
      try {
        await access(`/etc/${file}.conf`);
      } catch (error) {
        toaster.push(
          <Message
            type="error"
            showIcon
            closable
          >{`Cannot access: /etc/${file}.conf`}</Message>
        );
        ipcRenderer.send('debug', error);
      }
      try {
        const data = await readFile(`/etc/${file}.conf`, {
          encoding: 'utf8',
        });
        const hasFlags = data.match(regex);
        writeFile(`/tmp/${file}.conf.bak`, data).then(() =>
          toaster.push(
            <Message
              type="info"
              showIcon
              closable
            >{`Configuration backed up at /tmp/${file}.conf.bak`}</Message>
          )
        );
        if (hasFlags) {
          writeFile(
            `/tmp/${file}.conf`,
            `${data.replace(regex, '')}\n\n# Patched by RebornOS Fire v${
              process.env.VERSION
            } #\n# Old value: ${hasFlags}\n${value}\n`
          );
        } else {
          if (file === 'pacman') {
            writeFile(
              `/tmp/${file}.conf`,
              `${data.replace(
                regex,
                `[options]\n${value}`
              )}\n\n# Patched by RebornOS Fire v${
                process.env.VERSION
              } #\n# new value: ${value} #\n`
            );
          } else {
            writeFile(
              `/tmp/${file}.conf`,
              `${data}\n${value}\n\n# Patched by RebornOS Fire v${process.env.VERSION} #\n# new value: ${value} #\n`
            );
          }
        }
      } catch (error) {
        toaster.push(
          <Message
            type="error"
            showIcon
            closable
          >{`Cannot read: /etc/${file}.conf!`}</Message>
        );
        return ipcRenderer.send('debug', error);
      }
      ipcRenderer.once('termExit', (_, data) => {
        if (data.signal || data.exitCode) {
          toaster.push(
            <Message type="error" showIcon closable>
              Failed to update configuration!
            </Message>
          );
        } else {
          toaster.push(
            <Message type="success" showIcon closable>
              Configuration updated successfully!
            </Message>
          );
        }
        setRefresh({
          loading: true,
          text: 'Reloading',
        });
        ipcRenderer.send('generateLogs');
        ipcRenderer.once('logsGenerated', (_e, logs) => {
          toaster.push(
            <Message
              type="info"
              showIcon
              closable
            >{`Logs generated, File can be found at: ${logs}`}</Message>
          );
        });
      });
      ipcRenderer.send(
        'termExec',
        ['cp', `/tmp/${file}.conf`, `/tmp/${file}.conf.bak`, '/etc'],
        'System Tweaks'
      );
    },
    []
  );
  useEffect(() => {
    if (!refresh.loading) {
      return;
    }
    try {
      readFile(`/etc/pacman.conf`, {
        encoding: 'utf8',
      }).then(pacman => {
        readFile('/etc/makepkg.conf', {
          encoding: 'utf8',
        }).then(makepkg => {
          setDownloads(
            parseInt(pacman.match(pacmanRegex)?.[0].match(/\d+/)?.[0], 10) || 5
          );
          setConf({
            pacman: {
              enabled: !!pacman.match(pacmanRegex),
            },
            makepkg: {
              enabled: !!makepkg.match(makepkgRegex),
            },
          });
        });
      });
    } catch (error) {
      ipcRenderer.send('debug', error);
    }
    setRefresh({
      loading: false,
      text: 'Reload',
    });
  }, [makepkgRegex, pacmanRegex, refresh]);
  return (
    <div>
      <Panel
        style={{
          textAlign: 'center',
        }}
        header={<h3>System Tweaks</h3>}
        bodyFill
      />
      <ReloadBar
        action={() =>
          setRefresh(x => {
            if (!x.loading) {
              return {
                loading: true,
                text: 'Reloading',
              };
            }
            return x;
          })
        }
        pulseState={refresh.loading}
        text={refresh.text}
      />
      <FlexboxGrid
        justify="space-between"
        style={{
          paddingLeft: '10px',
          paddingRight: '30px',
        }}
      >
        <FlexboxGrid.Item>
          <h4>Enable multi-threading for make in makepkg.conf</h4>
        </FlexboxGrid.Item>
        <FlexboxGrid.Item>
          <Toggle
            checkedChildren={<LegacyCheckIcon />}
            unCheckedChildren={<LegacyCloseIcon />}
            checked={conf.makepkg.enabled}
            onChange={checked => {
              if (checked) {
                return handleToggle(
                  'makepkg',
                  `MAKEFLAGS="-j${cpus().length / 2}"`,
                  makepkgRegex
                );
              }
              return handleToggle(
                'makepkg',
                `# MAKEFLAGS="-j${cpus().length / 2}"`,
                makepkgRegex
              );
            }}
          />
        </FlexboxGrid.Item>
      </FlexboxGrid>
      <Divider />
      <FlexboxGrid
        justify="space-between"
        style={{
          paddingLeft: '10px',
          paddingRight: '30px',
        }}
      >
        <FlexboxGrid.Item>
          <h4>
            Pacman parallel downloads
            <InputGroup style={{width: 160}}>
              <InputGroup.Button
                onClick={() =>
                  setDownloads(x => {
                    if (x === 1) {
                      return 1;
                    }
                    return x - 1;
                  })
                }
                disabled={downloads === 1}
              >
                -
              </InputGroup.Button>
              <InputNumber
                value={downloads}
                className={'custom-input-number'}
              />
              <InputGroup.Button
                onClick={() =>
                  setDownloads(x => {
                    if (x === 20) {
                      return 20;
                    }
                    return x + 1;
                  })
                }
                disabled={downloads === 20}
              >
                +
              </InputGroup.Button>
            </InputGroup>
          </h4>
        </FlexboxGrid.Item>
        <FlexboxGrid.Item>
          <Toggle
            checkedChildren={<LegacyCheckIcon />}
            unCheckedChildren={<LegacyCloseIcon />}
            checked={conf.pacman.enabled}
            onChange={checked => {
              if (checked) {
                return handleToggle(
                  'pacman',
                  `ParallelDownloads = ${parseInt(downloads, 10) || 1}`,
                  pacmanRegex
                );
              }
              return handleToggle(
                'pacman',
                '# ParallelDownloads = 5',
                pacmanRegex
              );
            }}
          />
        </FlexboxGrid.Item>
      </FlexboxGrid>
      <Divider />
    </div>
  );
}
