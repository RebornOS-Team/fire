/* disabled as config defaults have strings and config cannot be updated
 * by users manually (causes encryption removal and regenerates the config.
 * encryption key is different for every build and it is not accessible by the user)
 */
/* eslint-disable security/detect-non-literal-regexp */
/* Regex(s) used here are safe and this is a eslint plugin bug */
/* eslint-disable security/detect-unsafe-regex */
import Modal from 'rsuite/Modal';
import FlexboxGrid from 'rsuite/FlexboxGrid';
import Button from 'rsuite/Button';
import Panel from 'rsuite/Panel';
import Col from 'rsuite/Col';
import Divider from 'rsuite/Divider';
import ButtonGroup from 'rsuite/ButtonGroup';
import PanelGroup from 'rsuite/PanelGroup';
import Loader from 'rsuite/Loader';
import SelectPicker from 'rsuite/SelectPicker';
import React, {useState, useEffect, useCallback} from 'react';
import {execFileSync} from 'child_process';
import {useGlobalStore} from '../utils/store';
import ReloadBar from './ReloadBar';
import RenderInstallation from './RenderInstallation';
import modules from '../utils/modules';
import {centra} from '@nia3208/centra';
import {ipcRenderer} from 'electron';

/**
 * @function RenderKernels
 * @author SoulHarsh007 <harsh.peshwani@outlook.com>
 * @copyright SoulHarsh007 2021
 * @since v1.0.0-rc-3
 * @description Used for rendering Utilities
 * @returns {import('react').JSXElementConstructor} - React Body
 */
export default function RenderKernels() {
  const {dispatch} = useGlobalStore();
  const [scanPackages, setScanPackages] = useState(true);
  /**
   * @type {[{name: string, description: string, installed: boolean, package: RegExp, deps: string[]}, React.Dispatch<React.SetStateAction<{name: string, description: string, installed: boolean, package: RegExp, deps: string[]}>>]}
   */
  const [pkg, setPkg] = useState({});
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [refresh, setRefresh] = useState({
    loading: true,
    text: 'Reloading',
  });
  const data = modules.get('kernels');
  const [packages, setPackages] = useState(
    data.map(x => {
      x.package = new RegExp(x.package.source, x.package.flags);
      x.match = new RegExp(x.match.source, x.match.flags);
      return x;
    })
  );
  const [versions, setVersions] = useState(
    data.map(x => ({
      name: x.name,
      versions: [
        {
          label: 'Latest',
          value: 'Latest',
        },
      ],
      selected: 'Latest',
    }))
  );
  const fetchVersions = useCallback(
    async id => {
      if (versions.find(x => x.name === id.name).versions.length !== 1) {
        return;
      }
      let info;
      try {
        info = await centra(
          `https://asia.archive.pkgbuild.com/packages/l/${id.deps[0]}/`,
          'GET'
        ).text();
      } catch (error) {
        ipcRenderer.send('debug', error);
      }
      try {
        const version = [];
        info
          ?.match(
            new RegExp(
              `${id.deps[0]}-${id.match.source}-x86_64.pkg.tar.(zst|xz)`,
              'g'
            )
          )
          ?.forEach(link => {
            const name = link;
            const match = name?.match(id.match);
            if (match?.length && !version.find(x => x.label === match[0])) {
              version.push({
                label: match[0],
                value: name.replace('.sig', ''),
              });
            }
          });
        if (version?.length) {
          setVersions(x =>
            x.map(y => {
              if (y.name === id.name) {
                y.versions = [
                  {
                    label: 'Latest',
                    value: 'Latest',
                  },
                  ...[...new Set(version)],
                ];
              }
              return y;
            })
          );
        }
      } catch (error) {
        ipcRenderer.send('debug', error);
      }
    },
    [versions]
  );
  useEffect(() => {
    const scanned = execFileSync('pacman', ['-Qq']).toString();
    setPackages(x =>
      x.map(y =>
        scanned.match(y.package)?.length
          ? {
              ...y,
              installed: true,
            }
          : {
              ...y,
              installed: false,
            }
      )
    );
    setRefresh({
      loading: false,
      text: 'Reload',
    });
  }, [scanPackages]);
  return (
    <>
      <Panel
        style={{
          textAlign: 'center',
        }}
        header={<h3>Kernel Management</h3>}
        bodyFill
      />
      <ReloadBar
        action={() =>
          setRefresh(x => {
            if (!x.loading) {
              setScanPackages(y => !y);
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
      <PanelGroup>
        <FlexboxGrid
          justify="space-around"
          style={{
            textAlign: 'center',
          }}
        >
          {packages.map((x, i) => {
            const versionData = versions.find(y => y.name === x.name);
            const latestInstall =
              x.installed && versionData.selected === 'Latest';
            return (
              <FlexboxGrid.Item
                as={Col}
                colspan={28}
                md={6}
                key={i}
                style={{
                  paddingBottom: '10px',
                  display: 'inline-flex',
                }}
              >
                <Panel header={<>{x.name}</>} bodyFill>
                  <span
                    style={{
                      height: 145,
                    }}
                  >
                    {x.description}
                    <Divider />
                    <Button
                      appearance="ghost"
                      onClick={() => {
                        setPkg(x);
                        setShowConfirmation(true);
                      }}
                      disabled={
                        packages.filter(y => y.installed).length === 1 &&
                        latestInstall
                      }
                    >
                      {latestInstall ? 'Un-Install' : 'Install'}
                    </Button>
                    <SelectPicker
                      onOpen={() => fetchVersions(x)}
                      onSelect={value =>
                        setVersions(y =>
                          y.map(z => {
                            if (z.name === x.name) {
                              z.selected = value;
                            }
                            return z;
                          })
                        )
                      }
                      onClean={() =>
                        setVersions(y =>
                          y.map(z => {
                            if (z.name === x.name) {
                              z.selected = 'Latest';
                            }
                            return z;
                          })
                        )
                      }
                      data={versionData.versions}
                      placeholder="Version"
                      renderMenu={menu => {
                        if (versionData.versions.length === 1) {
                          return (
                            <div
                              style={{
                                padding: 4,
                                color: '#999',
                                textAlign: 'center',
                              }}
                            >
                              <Loader
                                size="md"
                                content="Fetching Versions..."
                                vertical
                              />
                            </div>
                          );
                        }
                        return menu;
                      }}
                    />
                  </span>
                </Panel>
              </FlexboxGrid.Item>
            );
          })}
        </FlexboxGrid>
      </PanelGroup>
      <Modal
        size="xs"
        open={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        backdrop="static"
        keyboard={false}
        style={{
          textAlign: 'center',
        }}
      >
        <Modal.Header closeButton={false}>Are you sure?</Modal.Header>
        <Modal.Body>
          You are about to{' '}
          {pkg.installed &&
          versions.find(x => x.name === pkg.name).selected === 'Latest'
            ? 'un-install'
            : 'install'}
          : {pkg.name}
        </Modal.Body>
        <Modal.Footer>
          <ButtonGroup justified>
            <Button
              onClick={() => {
                setShowConfirmation(false);
                const {selected, versions: v} = versions.find(
                  x => x.name === pkg.name
                );
                console.log(
                  selected,
                  v.find(x => x.value === selected)
                );
                if (!pkg.installed && selected === 'Latest') {
                  dispatch({
                    type: 'InstallationUpdate',
                    status: true,
                    name: pkg.name,
                    deps: pkg.deps,
                    goto: <RenderInstallation />,
                    origin: <RenderKernels />,
                    terminal: true,
                  });
                  return new Notification('Installation Started!', {
                    icon: '/icon.png',
                    body: `Installation started for: ${pkg.name}`,
                  });
                }
                if (pkg.installed && selected === 'Latest') {
                  dispatch({
                    type: 'UnInstallationUpdate',
                    status: true,
                    name: pkg.name,
                    deps: pkg.deps,
                    goto: <RenderInstallation />,
                    origin: <RenderKernels />,
                    terminal: true,
                  });
                  return new Notification('Un-Installation Started!', {
                    icon: '/icon.png',
                    body: `Un-Installation started for: ${pkg.name}`,
                  });
                }
                dispatch({
                  type: 'VersionInstallationUpdate',
                  status: true,
                  name: pkg.name,
                  deps: [
                    `https://asia.archive.pkgbuild.com/packages/l/${pkg.deps[0]}/${selected}`,
                    `https://asia.archive.pkgbuild.com/packages/l/${pkg.deps[0]}/${selected}`.replaceAll(
                      pkg.deps[0],
                      pkg.deps[1]
                    ),
                  ],
                  goto: <RenderInstallation />,
                  origin: <RenderKernels />,
                  terminal: true,
                });
                return new Notification('Installation Started!', {
                  icon: '/icon.png',
                  body: `Installation started for: ${pkg.name} (v${selected})`,
                });
              }}
              appearance="primary"
            >
              Yes
            </Button>
            <Button
              onClick={() => setShowConfirmation(false)}
              appearance="subtle"
            >
              Cancel
            </Button>
          </ButtonGroup>
        </Modal.Footer>
      </Modal>
    </>
  );
}
