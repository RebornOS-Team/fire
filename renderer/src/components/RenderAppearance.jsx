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
import {useGlobalStore} from '../utils/store';
import RenderInstallation from './RenderInstallation';
import ReloadBar from './ReloadBar';
import modules from '../utils/modules';
import {execFileSync} from 'child_process';

/**
 * @function RenderAppearance
 * @author SoulHarsh007 <harsh.peshwani@outlook.com>
 * @copyright SoulHarsh007 2021
 * @since v1.0.0-Pre-Alpha
 * @description Used for rendering Appearance menu
 * @returns {import('react').JSXElementConstructor} - React Body
 */
export default function RenderAppearance() {
  const {dispatch} = useGlobalStore();
  const [scanPackages, setScanPackages] = useState(true);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showLastConfirmation, setShowLastConfirmation] = useState(false);
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
    modules.get('appearance').map(x => {
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
        header={<h3>Appearance</h3>}
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
                            setPkg(x);
                            setShowConfirmation(true);
                          }}
                          disabled={x.installed}
                        >
                          {x.installed ? 'Installed' : 'Install'}
                        </Button>
                        <Button
                          appearance="ghost"
                          style={{
                            display: 'none',
                          }}
                        >
                          Theming
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
                    origin: <RenderAppearance />,
                    terminal: true,
                  });
                  return new Notification('Installation Started!', {
                    icon: '/icon.png',
                    body: `Installation started for: ${pkg.name}`,
                  });
                }
                if (packages.filter(x => x.installed).length === 1) {
                  return setShowLastConfirmation(true);
                }
                dispatch({
                  type: 'UnInstallationUpdate',
                  status: true,
                  name: pkg.name,
                  deps: pkg.deps,
                  goto: <RenderInstallation />,
                  origin: <RenderAppearance />,
                  terminal: true,
                });
                return new Notification('Un-Installation Started!', {
                  icon: '/icon.png',
                  body: `Un-Installation started for: ${pkg.name}`,
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
        size="xs"
        open={showLastConfirmation}
        onClose={() => setShowLastConfirmation(false)}
        backdrop="static"
        keyboard={false}
        style={{
          textAlign: 'center',
        }}
      >
        <Modal.Header closeButton={false}>
          <LegacyWarningIcon /> Warning: Last DE detected
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
                dispatch({
                  type: 'UnInstallationUpdate',
                  status: true,
                  name: pkg.name,
                  deps: pkg.deps,
                  goto: <RenderInstallation />,
                  origin: <RenderAppearance />,
                  terminal: true,
                });
                return new Notification('Un-Installation Started!', {
                  icon: '/icon.png',
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
        open={img.show}
        style={{
          textAlign: 'center',
        }}
        onClose={() =>
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
