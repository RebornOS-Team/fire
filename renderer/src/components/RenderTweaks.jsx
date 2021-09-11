import {
  Panel,
  FlexboxGrid,
  Divider,
  Alert,
  Toggle,
  Icon,
  InputNumber,
  InputGroup,
  Navbar,
  Nav,
} from 'rsuite';
import React, {createRef, useCallback, useEffect, useState} from 'react';
import {ipcRenderer} from 'electron';
import {access, readFile, writeFile} from 'fs/promises';
import {cpus} from 'os';

/**
 * @function RenderTweaks
 * @author SoulHarsh007 <harsh.peshwani@outlook.com>
 * @copyright SoulHarsh007 2021
 * @since v1.0.0-Pre-Alpha
 * @description Used for rendering System Management
 * @returns {import('react').JSXElementConstructor} React Body
 */
export function RenderTweaks() {
  const inputRef = createRef();
  const [conf, setConf] = useState({
    'pacman.conf': {
      regex: /^(?!#.*$)( |\t)*ParallelDownloads\s*=\s*[0-9]{1,}/gm,
      enabled: false,
    },
    'makepkg.conf': {
      regex: /^(?!#.*$)( |\t)*MAKEFLAGS\s*=\s*".+?"/gm,
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
     * @param {'pacman.conf' | 'makepkg.conf'} file - file name we are working on
     * @param {string} value - new value to set in file
     * @returns {Promise<void>}
     */
    async (file, value) => {
      try {
        await access(`/etc/${file}`);
      } catch (error) {
        Alert.error(`Cannot access: /etc/${file}`);
        ipcRenderer.send('debug', error);
      }
      try {
        const data = await readFile(`/etc/${file}`, {
          encoding: 'utf8',
        });
        const hasFlags = data.match(conf[`${file}`].regex)?.map(x => x.trim());
        if (hasFlags) {
          writeFile(`/tmp/${file}.bak`, data).then(() =>
            Alert.info(`Configuration backed up at /tmp/${file}.bak`)
          );
          writeFile(
            `/tmp/${file}`,
            `${data.replace(
              conf[`${file}`].regex,
              ''
            )}\n\n# Patched by RebornOS Fire v${
              process.env.VERSION
            } #\n# Old value: ${hasFlags}\n${value}\n`
          );
        } else {
          writeFile(
            `/tmp/${file}`,
            `${data.replace(
              conf[`${file}`].regex,
              ''
            )}\n\n# Patched by RebornOS Fire v${
              process.env.VERSION
            } #\n${value}\n`
          );
        }
      } catch (error) {
        Alert.error('Cannot read: /etc/makepkg.conf!');
        return ipcRenderer.send('debug', error);
      }
      ipcRenderer.send(
        'termExec',
        ['cp', `/tmp/${file}`, `/tmp/${file}.bak`, '/etc'],
        'System Tweaks'
      );
      ipcRenderer.once('termExit', (_event, data) => {
        if (data.signal || data.exitCode) {
          Alert.error('Failed to update configuration!');
        } else {
          Alert.success('Configuration updated successfully!');
        }
        setRefresh({
          loading: true,
          text: 'Reloading',
        });
        ipcRenderer.send('generateLogs');
        ipcRenderer.once('logsGenerated', (_event, data) => {
          Alert.info(`Logs generated, File can be found at: ${data}`);
        });
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  useEffect(() => {
    try {
      readFile(`/etc/pacman.conf`, {
        encoding: 'utf8',
      }).then(pacman => {
        readFile('/etc/makepkg.conf', {
          encoding: 'utf8',
        }).then(makepkg => {
          setConf({
            'pacman.conf': {
              regex: /^(?!#.*$)( |\t)*ParallelDownloads\s*=\s*[0-9]{1,}/gm,
              enabled: !!pacman.match(conf['pacman.conf'].regex),
            },
            'makepkg.conf': {
              regex: /^(?!#.*$)( |\t)*MAKEFLAGS\s*=\s*".+?"/gm,
              enabled: !!makepkg.match(conf['makepkg.conf'].regex),
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
    Alert.config({
      duration: 8000,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refresh.loading === true]);
  return (
    <div>
      <Panel
        style={{
          textAlign: 'center',
        }}
        header={<h3>System Tweaks</h3>}
        bodyFill
      />
      <Navbar appearance="subtle">
        <Navbar.Body>
          <Nav pullRight appearance="subtle" activeKey="1">
            <Nav.Item
              icon={<Icon icon="refresh" pulse={refresh.loading} />}
              eventKey="1"
              onClick={() =>
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
            >
              {refresh.text}
            </Nav.Item>
          </Nav>
        </Navbar.Body>
      </Navbar>
      <Divider />
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
            checkedChildren={<Icon icon="check" />}
            unCheckedChildren={<Icon icon="close" />}
            checked={conf['makepkg.conf'].enabled}
            onChange={async checked => {
              if (checked) {
                return await handleToggle(
                  'makepkg.conf',
                  `MAKEFLAGS="${cpus().length / 2}"`
                );
              }
              return await handleToggle(
                'makepkg.conf',
                `# MAKEFLAGS="${cpus().length / 2}"`
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
              <InputGroup.Button onClick={() => inputRef.current.handleMinus()}>
                -
              </InputGroup.Button>
              <InputNumber
                defaultValue={5}
                max={20}
                min={1}
                ref={inputRef}
                className={'custom-input-number'}
              />
              <InputGroup.Button onClick={() => inputRef.current.handlePlus()}>
                +
              </InputGroup.Button>
            </InputGroup>
          </h4>
        </FlexboxGrid.Item>
        <FlexboxGrid.Item>
          <Toggle
            checkedChildren={<Icon icon="check" />}
            unCheckedChildren={<Icon icon="close" />}
            checked={conf['pacman.conf'].enabled}
            onChange={async checked => {
              if (checked) {
                return await handleToggle(
                  'pacman.conf',
                  `ParallelDownloads = ${inputRef.current.state.value}`
                );
              }
              return await handleToggle(
                'pacman.conf',
                '# ParallelDownloads = 5'
              );
            }}
          />
        </FlexboxGrid.Item>
      </FlexboxGrid>
      <Divider />
    </div>
  );
}
