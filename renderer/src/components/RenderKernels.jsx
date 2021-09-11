/* Regex(s) used here are safe and this is a eslint plugin bug */
/* eslint-disable security/detect-unsafe-regex */
import {
  Panel,
  Divider,
  Navbar,
  Icon,
  Nav,
  Button,
  PanelGroup,
  FlexboxGrid,
  Col,
  Modal,
  ButtonGroup,
  SelectPicker,
  Loader,
} from 'rsuite';
import React, {useState, useEffect, useCallback} from 'react';
import {execSync} from 'child_process';
import {useGlobalStore} from '../utils/store';
import {RenderInstallation} from './RenderInstallation';
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
export function RenderKernels() {
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
  const [packages, setPackages] = useState([
    {
      name: 'Linux',
      description: 'The default Arch Linux kernel and modules',
      installed: false,
      package: /^linux$/gm,
      deps: ['linux', 'linux-headers'],
      match: /([0-9]{1,2}\.){2}([0-9]{1,3}\.)?arch[0-9]-[0-9]/g,
    },
    {
      name: 'Linux LTS',
      description: 'The LTS Linux kernel and modules',
      installed: false,
      package: /^linux-lts$/gm,
      deps: ['linux-lts', 'linux-lts-headers'],
      match: /([0-9]{1,2}\.){2}([0-9]{1,3})?-[0-9]/g,
    },
    {
      name: 'Linux Zen',
      description: 'The Linux ZEN kernel and modules',
      installed: false,
      package: /^linux-zen$/gm,
      deps: ['linux-zen', 'linux-zen-headers'],
      match: /([0-9]{1,2}\.){2}([0-9]{1,3}\.)?zen[0-9]-[0-9]/g,
    },
    {
      name: 'Linux Hardened',
      description: 'The Security-Hardened Linux kernel and modules',
      installed: false,
      package: /^linux-hardened$/gm,
      deps: ['linux-hardened', 'linux-hardened-headers'],
      match: /([0-9]{1,2}\.){2}([0-9]{1,3}\.)?(hardened[0-9]|a)-[0-9]/g,
    },
  ]);
  const [versions, setVersions] = useState([
    {
      name: 'Linux',
      versions: [
        {
          label: 'Latest',
          value: 'Latest',
        },
      ],
      selected: 'Latest',
    },
    {
      name: 'Linux LTS',
      versions: [
        {
          label: 'Latest',
          value: 'Latest',
        },
      ],
      selected: 'Latest',
    },
    {
      name: 'Linux Zen',
      versions: [
        {
          label: 'Latest',
          value: 'Latest',
        },
      ],
      selected: 'Latest',
    },
    {
      name: 'Linux Hardened',
      versions: [
        {
          label: 'Latest',
          value: 'Latest',
        },
      ],
      selected: 'Latest',
    },
  ]);
  const fetchVersions = useCallback(
    async id => {
      if (versions.find(x => x.name === id.name).versions.length === 1) {
        let data;
        try {
          data = await centra(
            `https://archive.archlinux.org/packages/l/${id.deps[0]}/`,
            'GET'
          ).text();
        } catch (error) {
          ipcRenderer.send(
            'debug',
            error.stack ??
              error.message ??
              'Failed at fetching data, Error has no stack/message'
          );
        }
        const version = data?.match(id.match);
        if (version?.length) {
          setVersions(x =>
            x.map(y => {
              if (y.name === id.name) {
                y.versions = [
                  {
                    label: 'Latest',
                    value: 'Latest',
                  },
                  ...[...new Set(version)].map(y => ({label: y, value: y})),
                ];
              }
              return y;
            })
          );
        }
      }
    },
    [versions]
  );
  useEffect(() => {
    const scanned = execSync('pacman -Qq').toString();
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
      <Navbar appearance="subtle">
        <Navbar.Body>
          <Nav pullRight appearance="subtle" activeKey="1">
            <Nav.Item
              icon={<Icon icon="refresh" pulse={refresh.loading} />}
              eventKey="1"
              onClick={() =>
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
            >
              {refresh.text}
            </Nav.Item>
          </Nav>
        </Navbar.Body>
      </Navbar>
      <Divider />
      <PanelGroup>
        <FlexboxGrid
          justify="space-around"
          style={{
            textAlign: 'center',
          }}
        >
          {packages.map((x, i) => {
            const versionData = versions.find(y => y.name === x.name);
            return (
              <FlexboxGrid.Item
                componentClass={Col}
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
                        packages.filter(x => x.installed).length === 1 &&
                        x.installed &&
                        versionData.selected === 'Latest'
                      }
                    >
                      {x.installed && versionData.selected === 'Latest'
                        ? 'Un-Install'
                        : 'Install'}
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
                            <p
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
                            </p>
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
        show={showConfirmation}
        onHide={() => setShowConfirmation(false)}
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
                const {selected} = versions.find(x => x.name === pkg.name);
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
                  new Notification('Un-Installation Started!', {
                    icon: '/icon.png',
                    body: `Un-Installation started for: ${pkg.name}`,
                  });
                }
                dispatch({
                  type: 'VersionInstallationUpdate',
                  status: true,
                  name: pkg.name,
                  deps: pkg.deps.map(
                    x =>
                      `https://archive.archlinux.org/packages/l/${x}/${x}-${selected}-x86_64.pkg.tar.xz`
                  ),
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
