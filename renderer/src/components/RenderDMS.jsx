import {
  Nav,
  Icon,
  Modal,
  FlexboxGrid,
  Button,
  Navbar,
  Panel,
  Col,
  Row,
  Divider,
  ButtonGroup,
  PanelGroup,
} from 'rsuite';
import React, {useState, useEffect} from 'react';
import {execSync} from 'child_process';
import {useGlobalStore} from '../utils/store';
import {RenderInstallation} from './RenderInstallation';
import {RenderUnInstallation} from './RenderUnInstallation';
import {RenderEnable} from './RenderEnable';
import {readlinkSync, existsSync} from 'fs';

/**
 * @function RenderDMS
 * @author SoulHarsh007 <harshtheking@hotmail.com>
 * @copyright SoulHarsh007 2021
 * @since v1.0.0-Pre-Alpha
 * @description Used for rendering Display Managers
 * @returns {import('react').JSXElementConstructor} - React Body
 */
export function RenderDMS() {
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
  const [packages, setPackages] = useState([
    {
      name: 'LightDM',
      description: 'A lightweight display manager',
      image: '/lightdm.webp',
      installed: false,
      package: /(lightdm)(-(devel|git))?/g,
      deps: ['lightdm', 'lightdm-gtk-greeter'],
      enabled: false,
    },
    {
      name: 'SDDM',
      description: 'QML based X11 and Wayland display manager',
      image: '/sddm.webp',
      installed: false,
      package: /(sddm)(-wayland)?(-git)?/g,
      deps: ['sddm'],
      enabled: false,
    },
    {
      name: 'GDM',
      description: 'GNOME Display manager and login screen',
      image: '/gdm.webp',
      installed: false,
      package: /(gdm)(-git)?/g,
      deps: ['gdm'],
      enabled: false,
    },
    {
      name: 'LXDM',
      description: 'Lightweight X11 Display Manager',
      image: '/lxdm.webp',
      installed: false,
      package: /(lxdm)(-(git|gtk3))?/g,
      deps: ['lxdm-gtk3'],
      enabled: false,
    },
  ]);
  useEffect(() => {
    const scanned = execSync('pacman -Qq').toString();
    const enabled = existsSync('/etc/systemd/system/display-manager.service')
      ? readlinkSync('/etc/systemd/system/display-manager.service')
          ?.match(/[a-z]*\.service/g)?.[0]
          ?.split('.')?.[0]
          ?.toLowerCase()
      : 'TTY';
    setCurrentDM(enabled);
    setPackages(x =>
      x.map(y =>
        scanned.match(y.package)?.length
          ? {
              name: y.name,
              description: y.description,
              image: y.image,
              installed: true,
              package: y.package,
              deps: y.deps,
              enabled: enabled === y.name.toLowerCase(),
            }
          : y
      )
    );
    setRefresh({
      loading: false,
      text: 'Reload',
    });
  }, [scanPackages]);
  return (
    <>
      <Row
        style={{
          textAlign: 'center',
        }}
      >
        <Panel header={<h3>Display Managers</h3>} bodyFill></Panel>
      </Row>
      <Navbar>
        <Navbar.Body>
          <Nav pullRight appearance="subtle" activeKey="1">
            <Nav.Item
              icon={<Icon icon="refresh" pulse={refresh.loading} />}
              eventKey="1"
              onSelect={() =>
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
          {packages.map((x, i) => (
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
                    new Notification('Installation Started!', {
                      icon: '/icon.png',
                      body: `Installation started for: ${pkg.name}`,
                    });
                    break;
                  case 'uninstall':
                    if (
                      packages.filter(x => x.installed).length === 1 &&
                      pkg.enabled
                    ) {
                      return setShowLastConfirmation({
                        title: (
                          <>
                            <Icon icon="warning" /> Warning: Last DM Detected
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
                          deps: pkg.deps,
                          goto: <RenderUnInstallation />,
                          origin: <RenderDMS />,
                          terminal: true,
                        },
                      });
                    } else {
                      dispatch({
                        type: 'UnInstallationUpdate',
                        status: true,
                        name: pkg.name,
                        deps: pkg.deps,
                        goto: <RenderUnInstallation />,
                        origin: <RenderDMS />,
                        terminal: true,
                      });
                      new Notification('Un-Installation Started!', {
                        icon: '/icon.png',
                        body: `Un-Installation started for: ${pkg.name}`,
                      });
                    }
                    break;
                  case 'enable':
                    if (currentDM !== 'TTY') {
                      return setShowLastConfirmation({
                        title: (
                          <>
                            <Icon icon="warning" /> Warning: DM Conflict
                            Detected
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
                            `"systemctl disable ${currentDM}.service && systemctl enable ${pkg.name.toLowerCase()}.service"`,
                          ],
                          goto: <RenderEnable />,
                          origin: <RenderDMS />,
                          terminal: true,
                        },
                      });
                    } else {
                      dispatch({
                        type: 'EnableUpdate',
                        status: true,
                        name: pkg.name,
                        deps: [
                          'systemctl',
                          'enable',
                          `${pkg.name.toLowerCase()}.service`,
                        ],
                        goto: <RenderEnable />,
                        origin: <RenderDMS />,
                        terminal: true,
                      });
                      new Notification(`Enabling ${pkg.name}`, {
                        icon: '/icon.png',
                        body: `Enabling ${pkg.name}`,
                      });
                    }
                    break;
                  case 'disable':
                    setShowLastConfirmation({
                      title: (
                        <>
                          <Icon icon="warning" /> Warning: No DM Access
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
                        goto: <RenderEnable />,
                        origin: <RenderDMS />,
                        terminal: true,
                      },
                    });
                    break;
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
        show={showLastConfirmation.show}
        onHide={() => setShowLastConfirmation({})}
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
                new Notification(showLastConfirmation.notificationTitle, {
                  icon: '/icon.png',
                  body: showLastConfirmation.notificationBody,
                });
                setShowLastConfirmation({});
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
        full={true}
        show={img.show}
        style={{
          textAlign: 'center',
        }}
        onHide={() =>
          setImg(x => {
            return {
              show: false,
              url: x.url,
              name: '',
            };
          })
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
