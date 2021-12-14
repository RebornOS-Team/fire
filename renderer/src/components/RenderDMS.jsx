import Modal from 'rsuite/Modal';
import FlexboxGrid from 'rsuite/FlexboxGrid';
import Button from 'rsuite/Button';
import Panel from 'rsuite/Panel';
import Col from 'rsuite/Col';
import Divider from 'rsuite/Divider';
import ButtonGroup from 'rsuite/ButtonGroup';
import PanelGroup from 'rsuite/PanelGroup';
import LegacyWarningIcon from '@rsuite/icons/legacy/Warning';
import React, {useState, useEffect} from 'react';
import {execFileSync} from 'child_process';
import {useGlobalStore} from '../utils/store';
import ReloadBar from './ReloadBar';
import RenderInstallation from './RenderInstallation';
import modules from '../utils/modules';
import {readlinkSync} from 'fs';
import {ipcRenderer} from 'electron';

/**
 * @function RenderDMS
 * @author SoulHarsh007 <harsh.peshwani@outlook.com>
 * @copyright SoulHarsh007 2021
 * @since v1.0.0-Pre-Alpha
 * @description Used for rendering Display Managers
 * @returns {import('react').JSXElementConstructor} - React Body
 */
export default function RenderDMS() {
  const {dispatch} = useGlobalStore();
  const [currentDM, setCurrentDM] = useState('TTY');
  const [scanPackages, setScanPackages] = useState(true);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showLastConfirmation, setShowLastConfirmation] = useState({
    title: '',
    body: '',
    dispatchData: {},
    notificationTitle: '',
    notificationBody: '',
    show: false,
  });
  const [pkg, setPkg] = useState({});
  const [img, setImg] = useState({
    show: false,
    url: '',
    name: '',
  });
  const [refresh, setRefresh] = useState({
    loading: true,
    text: 'Reloading',
  });
  const [packages, setPackages] = useState(
    modules.get('dms').map(x => {
      /* disabled as config defaults have strings and config cannot be updated
       * by users manually (causes encryption removal and regenerates the config.
       * encryption key is different for every build and it is not accessible by the user)
       */
      // eslint-disable-next-line security/detect-non-literal-regexp
      x.package = new RegExp(x.package.source, x.package.flags);
      return x;
    })
  );
  useEffect(() => {
    const scanned = execFileSync('pacman', ['-Qq']).toString();
    let enabled = 'TTY';
    try {
      enabled = readlinkSync('/etc/systemd/system/display-manager.service')
        ?.match(/[a-z]*\.service/g)?.[0]
        ?.split('.')?.[0]
        ?.toLowerCase();
    } catch (e) {
      ipcRenderer.send('debug', e);
    }
    setCurrentDM(enabled);
    setPackages(x =>
      x.map(y =>
        scanned.match(y.package)?.length
          ? {
              ...y,
              installed: true,
              enabled: enabled === y.name.toLowerCase(),
            }
          : {
              ...y,
              enabled: enabled === y.name.toLowerCase(),
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
        header={<h3>Display Managers</h3>}
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
          {packages.map((x, i) => (
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
              <Panel
                shaded
                bordered
                bodyFill
                style={{
                  width: 300,
                }}
              >
                <img
                  src={x.image}
                  height={169}
                  width={300}
                  onClick={() =>
                    setImg({
                      show: true,
                      name: x.name,
                      url: x.image,
                    })
                  }
                  alt={x.name}
                />
                <Panel
                  header={
                    <>
                      {x.name}
                      <Divider />
                      <ButtonGroup justified>
                        <Button
                          appearance="ghost"
                          onClick={() => {
                            setPkg({
                              ...x,
                              cmd: x.installed ? 'uninstall' : 'install',
                            });
                            setShowConfirmation(true);
                          }}
                        >
                          {x.installed ? 'Un-Install' : 'Install'}
                        </Button>
                        <Button
                          appearance="ghost"
                          disabled={!x.installed && !x.enabled}
                          onClick={() => {
                            setPkg({
                              ...x,
                              cmd: x.enabled ? 'disable' : 'enable',
                            });
                            setShowConfirmation(true);
                          }}
                        >
                          {x.enabled ? 'Disable' : 'Enable'}
                        </Button>
                      </ButtonGroup>
                    </>
                  }
                  bodyFill
                >
                  <Divider />
                  <p
                    style={{
                      height: 145,
                    }}
                  >
                    {x.description}
                  </p>
                </Panel>
              </Panel>
            </FlexboxGrid.Item>
          ))}
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
          You are about to {pkg.cmd}: {pkg.name}
        </Modal.Body>
        <Modal.Footer>
          <ButtonGroup justified>
            <Button
              onClick={() => {
                setShowConfirmation(false);
                switch (pkg.cmd) {
                  case 'install':
                    dispatch({
                      type: 'InstallationUpdate',
                      status: true,
                      name: pkg.name,
                      deps: pkg.deps,
                      goto: <RenderInstallation />,
                      origin: <RenderDMS />,
                      terminal: true,
                    });
                    return new Notification('Installation Started!', {
                      icon: '/icon.png',
                      body: `Installation started for: ${pkg.name}`,
                    });
                  case 'uninstall':
                    if (
                      packages.filter(x => x.installed).length === 1 &&
                      pkg.enabled
                    ) {
                      return setShowLastConfirmation({
                        title: (
                          <>
                            <LegacyWarningIcon /> Warning: Last DM Detected
                          </>
                        ),
                        body: `If you un-install ${pkg.name}, you will be left with no desktop manager! Are you sure you want to do this?`,
                        show: true,
                        notificationTitle: `Un-Installation Started!`,
                        notificationBody: `Un-Installation started for: ${pkg.name}`,
                        dispatchData: {
                          type: 'UnInstallationUpdate',
                          status: true,
                          name: pkg.name,
                          deps: [pkg.deps[0]],
                          goto: <RenderInstallation />,
                          origin: <RenderDMS />,
                          terminal: true,
                        },
                      });
                    }
                    dispatch({
                      type: 'UnInstallationUpdate',
                      status: true,
                      name: pkg.name,
                      deps: [pkg.deps[0]],
                      goto: <RenderInstallation />,
                      origin: <RenderDMS />,
                      terminal: true,
                    });
                    return new Notification('Un-Installation Started!', {
                      icon: '/icon.png',
                      body: `Un-Installation started for: ${pkg.name}`,
                    });
                  case 'enable':
                    if (currentDM !== 'TTY') {
                      return setShowLastConfirmation({
                        title: (
                          <>
                            <LegacyWarningIcon /> Warning: DM Conflict Detected
                          </>
                        ),
                        body: `If you enable ${
                          pkg.name
                        }, ${currentDM.toUpperCase()} will be disabled! Are you sure you want to do this?`,
                        show: true,
                        notificationTitle: `Enabling ${pkg.name}`,
                        notificationBody: `Disabling: ${currentDM.toUpperCase()} and Enabling: ${
                          pkg.name
                        }`,
                        dispatchData: {
                          type: 'EnableUpdate',
                          status: true,
                          name: pkg.name,
                          deps: [
                            'sh',
                            '-c',
                            `systemctl disable ${currentDM}.service && systemctl enable ${pkg.name.toLowerCase()}.service`,
                          ],
                          goto: <RenderInstallation />,
                          origin: <RenderDMS />,
                          terminal: true,
                        },
                      });
                    }
                    dispatch({
                      type: 'EnableUpdate',
                      status: true,
                      name: pkg.name,
                      deps: [
                        'systemctl',
                        'enable',
                        `${pkg.name.toLowerCase()}.service`,
                      ],
                      goto: <RenderInstallation />,
                      origin: <RenderDMS />,
                      terminal: true,
                    });
                    return new Notification(`Enabling ${pkg.name}`, {
                      icon: '/icon.png',
                      body: `Enabling ${pkg.name}`,
                    });
                  case 'disable':
                    return setShowLastConfirmation({
                      title: (
                        <>
                          <LegacyWarningIcon /> Warning: No DM Access
                        </>
                      ),
                      body: `If you disable ${pkg.name}, You will not have any DM enabled! Are you sure you want to do this?`,
                      show: true,
                      notificationTitle: `Disabling ${pkg.name}`,
                      notificationBody: `Disabling: ${pkg.name}`,
                      dispatchData: {
                        type: 'EnableUpdate',
                        status: true,
                        name: pkg.name,
                        deps: [
                          'systemctl',
                          'disable',
                          `${pkg.name.toLowerCase()}.service`,
                        ],
                        goto: <RenderInstallation />,
                        origin: <RenderDMS />,
                        terminal: true,
                      },
                    });
                  default:
                    break;
                }
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
      <Modal
        size="xs"
        open={showLastConfirmation.show}
        onClose={() => setShowLastConfirmation({})}
        backdrop="static"
        keyboard={false}
        style={{
          textAlign: 'center',
        }}
      >
        <Modal.Header closeButton={false}>
          {showLastConfirmation.title}
        </Modal.Header>
        <Modal.Body>{showLastConfirmation.body}</Modal.Body>
        <Modal.Footer>
          <ButtonGroup justified>
            <Button
              onClick={() => {
                dispatch(showLastConfirmation.dispatchData);
                setShowLastConfirmation({});
                return new Notification(
                  showLastConfirmation.notificationTitle,
                  {
                    icon: '/icon.png',
                    body: showLastConfirmation.notificationBody,
                  }
                );
              }}
              appearance="primary"
            >
              Yes
            </Button>
            <Button
              onClick={() => setShowLastConfirmation({})}
              appearance="subtle"
            >
              Cancel
            </Button>
          </ButtonGroup>
        </Modal.Footer>
      </Modal>
      <Modal
        overflow={false}
        full
        open={img.show}
        style={{
          textAlign: 'center',
        }}
        onClose={() =>
          setImg(x => ({
            show: false,
            url: x.url,
            name: '',
          }))
        }
      >
        <Modal.Header>
          <Modal.Title>{img.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <img
            src={img.url}
            style={{
              flex: 1,
              width: '100%',
              height: '100%',
              resizeMode: 'contain',
            }}
            alt={img.name}
          />
        </Modal.Body>
      </Modal>
    </>
  );
}
