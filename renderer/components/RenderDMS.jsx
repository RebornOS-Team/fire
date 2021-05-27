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

/**
 * @function RenderDMS
 * @author SoulHarsh007 <harshtheking@hotmail.com>
 * @copyright SoulHarsh007 2021
 * @since v1.0.0-Beta
 * @description Used for rendering Display Managers
 * @returns {import('react').JSXElementConstructor} - React Body
 */
export function RenderDMS() {
  // eslint-disable-next-line no-unused-vars
  const [_, dispatch] = useContext(Context);
  const [scanPackages, setScanPackages] = useState(true);
  const [showConfirmation, setShowConfirmation] = useState(false);
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
      name: 'LightDM',
      description: 'A lightweight display manager',
      image: '/openbox.webp',
      installed: false,
      package: /(lightdm)(-(devel|git))?/g,
      deps: ['rebornos-cosmic-openbox'],
    },
    {
      name: 'SDDM',
      description: 'QML based X11 and Wayland display manager',
      image: '/sddm.webp',
      installed: false,
      package: /(sddm)(-wayland)?(-git)?/g,
      deps: ['rebornos-cosmic-i3'],
    },
    {
      name: 'GDM',
      description: 'GNOME Display manager and login screen',
      image: '/gdm.webp',
      installed: false,
      package: /(gdm)(-git)?/g,
      deps: ['rebornos-cosmic-budgie'],
    },
    {
      name: 'LXDM',
      description: 'Lightweight X11 Display Manager',
      image: '/cinnamon.webp',
      installed: false,
      package: /(lxdm)(-(git|gtk3))?/g,
      deps: ['rebornos-cosmic-cinnamon'],
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
                            disabled={x.installed}
                            onClick={() => {
                              setPkg(x);
                              setShowConfirmation(true);
                            }}
                          >
                            {x.installed ? 'Installed' : 'Install'}
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
        <Modal.Body>You are about to install: {pkg.name}</Modal.Body>
        <Modal.Footer>
          <ButtonGroup justified>
            <Button
              onClick={() => {
                setShowConfirmation(false);
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
