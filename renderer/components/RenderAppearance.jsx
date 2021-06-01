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
import {useState, useContext} from 'react';
import {execSync} from 'child_process';
import {Context} from '../utils/store';
import {RenderInstallation} from './RenderInstallation';
import {RenderUnInstallation} from './RenderUnInstallation';

/**
 * @function RenderAppearance
 * @author SoulHarsh007 <harshtheking@hotmail.com>
 * @copyright SoulHarsh007 2021
 * @since v1.0.0-Beta
 * @description Used for rendering Appearance menu
 * @returns {import('react').JSXElementConstructor} - React Body
 */
export function RenderAppearance() {
  // eslint-disable-next-line no-unused-vars
  const [_, dispatch] = useContext(Context);
  const [scanPackages, setScanPackages] = useState(true);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showLastConfirmation, setShowLastConfirmation] = useState(false);
  const [acceptedLastConfirm, setAcceptedLastConfirm] = useState(false);
  const [pkg, setPkg] = useState('');
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
      name: 'Openbox',
      description:
        'Not actually a desktop environment, Openbox is a highly configurable window manager. It is known for its minimalistic appearance and its flexibility. It is the most lightweight graphical option offered by RebornOS. Please Note: Openbox is not recommended for users who are new to Linux.',
      image: '/openbox.webp',
      installed: false,
      package: /(openbox)/g,
      deps: ['rebornos-cosmic-openbox'],
    },
    {
      name: 'i3',
      description:
        'i3 is a tiling window manager, completely written from scratch. i3 is primarily targeted at advanced users and developers. Target platforms are GNU/Linux and BSD operating systems',
      image: '/i3.webp',
      installed: false,
      package: /i3-(gaps|wm|git)(-(next|iconpatch))?(-git)?/g,
      deps: ['rebornos-cosmic-i3'],
    },
    {
      name: 'Budgie',
      description:
        'Budgie is the flagship desktop of Solus and is a Solus project. It focuses on simplicity and elegance. Written from scratch with integration in mind, the Budgie desktop tightly integrates with the GNOME stack, but offers an alternative desktop experience.',
      image: '/budgie.webp',
      installed: false,
      package: /(budgie-desktop)(-git)?/g,
      deps: ['rebornos-cosmic-budgie'],
    },
    {
      name: 'Cinnamon',
      description:
        'Cinnamon is a Linux desktop which provides advanced, innovative features and a traditional desktop user experience. Cinnamon aims to make users feel at home by providing them with an easy-to-use and comfortable desktop experience.',
      image: '/cinnamon.webp',
      installed: false,
      package: /(cinnamon)(-git)?/g,
      deps: ['rebornos-cosmic-cinnamon'],
    },
    {
      name: 'Deepin',
      description:
        'IMPORTANT: Keep in mind that the Deepin desktop can often be unstable. This does not depend on us, but on the developers of Deepin who usually upload BETA versions of the desktop or some components in the stable repositories of Arch Linux.',
      image: '/deepin.webp',
      installed: false,
      package: /(deepin-desktop-base)(-git)?/g,
      deps: ['rebornos-cosmic-deepin'],
    },
    {
      name: 'Enlightenment',
      description:
        'Enlightenment is not just a window manager for Linux/X11 and others, but also a whole suite of libraries to help you create beautiful user interfaces with much less work\n',
      image: '/enlightenment.webp',
      installed: false,
      package: /(enlightenment)(-git)?/g,
      deps: ['rebornos-cosmic-enlightenment'],
    },
    {
      name: 'GNOME',
      description:
        'GNOME is an easy and elegant way to use your computer. It features the Activities Overview which is an easy way to access all your basic tasks.',
      image: '/gnome.webp',
      installed: false,
      package: /(gnome-shell)(-git)?/g,
      deps: ['rebornos-cosmic-gnome'],
    },
    {
      name: 'KDE Plasma',
      description:
        "If you are looking for a familiar working environment, KDE's Plasma Desktop offers all the tools required for a modern desktop computing experience so you can be productive right from the start.",
      image: '/kde.webp',
      installed: false,
      package: /(plasma-desktop)(-git)?/g,
      deps: ['rebornos-cosmic-kde'],
    },
    {
      name: 'LXQt',
      description:
        'LXQt is the next-generation of LXDE, the Lightweight Desktop Environment. It is lightweight, modular, blazing-fast, and user-friendly.',
      image: '/lxqt.webp',
      installed: false,
      package: /(lxqt-config)(-git)?/g,
      deps: ['rebornos-cosmic-lxqt'],
    },
    {
      name: 'MATE',
      description:
        'MATE is an intuitive, attractive, and lightweight desktop environment which provides a more traditional desktop experience. Accelerated compositing is supported, but not required to run MATE making it suitable for lower-end hardware.',
      image: '/mate.webp',
      installed: false,
      package: /(mate-panel)(-git)?/g,
      deps: ['rebornos-cosmic-mate'],
    },
    {
      name: 'XFCE',
      description:
        'Xfce is a lightweight desktop environment. It aims to be fast and low on system resources, while remaining visually appealing and user friendly. It suitable for use on older computers and those with lower-end hardware specifications. ',
      image: '/xfce.webp',
      installed: false,
      package: /(xfce4-session)(-(git|devel|gtk2))?/g,
      deps: ['rebornos-cosmic-xfce'],
    },
  ]);
  if (scanPackages) {
    const scanned = execSync('pacman -Qq').toString();
    setScanPackages(x => !x);
    setPackages(x => {
      if (!scanned.length) {
        return x;
      }
      return x.map(y => {
        if (scanned.match(y.package)?.length) {
          return {
            name: y.name,
            description: y.description,
            image: y.image,
            installed: true,
            package: y.package,
            deps: y.deps,
          };
        }
        return y;
      });
    });
    setRefresh({
      loading: false,
      text: 'Reload',
    });
  }
  return (
    <>
      <Row
        style={{
          textAlign: 'center',
        }}
      >
        <Panel header={<h3>Appearance</h3>} bodyFill></Panel>
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
                    setScanPackages(x => !x);
                    return {
                      loading: true,
                      text: 'Reloading',
                    };
                  } else {
                    return x;
                  }
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
                              setPkg(x);
                              setShowConfirmation(true);
                            }}
                          >
                            {x.installed ? 'Un-Install' : 'Install'}
                          </Button>
                          <Button appearance="ghost">Theming</Button>
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
          You are about to {pkg.installed ? 'un-install' : 'install'}:{' '}
          {pkg.name}
        </Modal.Body>
        <Modal.Footer>
          <ButtonGroup justified>
            <Button
              onClick={() => {
                setShowConfirmation(false);
                if (!pkg.installed) {
                  dispatch({
                    type: 'InstallationUpdate',
                    status: true,
                    name: pkg.name,
                    deps: pkg.deps,
                    goto: <RenderInstallation />,
                  });
                  new Notification('Installation Started!', {
                    icon: `/icon.png`,
                    body: `Installation started for: ${pkg.name}`,
                  });
                } else {
                  if (
                    packages.filter(x => x.installed).length === 1 &&
                    !acceptedLastConfirm
                  ) {
                    return setShowLastConfirmation(true);
                  } else {
                    dispatch({
                      type: 'UnInstallationUpdate',
                      status: true,
                      name: pkg.name,
                      deps: pkg.deps,
                      goto: <RenderUnInstallation />,
                    });
                    new Notification('Un-Installation Started!', {
                      icon: `/icon.png`,
                      body: `Un-Installation started for: ${pkg.name}`,
                    });
                  }
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
        show={showLastConfirmation}
        onHide={() => setShowLastConfirmation(false)}
        backdrop="static"
        keyboard={false}
        style={{
          textAlign: 'center',
        }}
      >
        <Modal.Header closeButton={false}>
          <Icon icon="warning" /> Warning: Last DE detected
        </Modal.Header>
        <Modal.Body>
          Warning: If you un-install {pkg.name}, you will be left with no
          desktop environment! Are you sure you want to do this?
        </Modal.Body>
        <Modal.Footer>
          <ButtonGroup justified>
            <Button
              onClick={() => {
                setShowLastConfirmation(false);
                setAcceptedLastConfirm(true);
                dispatch({
                  type: 'UnInstallationUpdate',
                  status: true,
                  name: pkg.name,
                  deps: pkg.deps,
                  goto: <RenderUnInstallation />,
                });
                new Notification('Un-Installation Started!', {
                  icon: `/icon.png`,
                  body: `Un-Installation started for: ${pkg.name}`,
                });
              }}
              appearance="primary"
            >
              Yes
            </Button>
            <Button
              onClick={() => setShowLastConfirmation(false)}
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
          />
        </Modal.Body>
      </Modal>
    </>
  );
}
