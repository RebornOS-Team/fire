/* eslint-disable react/prop-types */
import Panel from 'rsuite/Panel';
import Divider from 'rsuite/Divider';
import Button from 'rsuite/Button';
import ButtonGroup from 'rsuite/ButtonGroup';
import FlexboxGrid from 'rsuite/FlexboxGrid';
import Modal from 'rsuite/Modal';
import React, {useState, useEffect, Fragment, useMemo} from 'react';
import {execFileSync} from 'child_process';
import {useGlobalStore} from '../utils/store';
import ReloadBar from './ReloadBar';
import modules from '../utils/modules';
import RenderInstallation from './RenderInstallation';

/**
 * @function RenderUtilities
 * @author SoulHarsh007 <harsh.peshwani@outlook.com>
 * @copyright SoulHarsh007 2021
 * @since v1.0.0-Pre-Alpha
 * @description Used for rendering Utilities
 * @param {{scrollTo?: string}} props - props for the component
 * @returns {import('react').JSXElementConstructor} - React Body
 */
export default function RenderUtilities(props) {
  const {dispatch} = useGlobalStore();
  const data = useMemo(() => modules.get('utils'), []);
  const [categories] = useState(data.categories);
  const [refresh, setRefresh] = useState({
    loading: true,
    text: 'Reloading',
  });
  console.log(data);
  const [scanPackages, setScanPackages] = useState(true);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pkg, setPkg] = useState({});
  const [packages, setPackages] = useState(
    data.packages.map(x => {
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
  useEffect(() => {
    if (props.scrollTo) {
      window.scrollTo(0, document.getElementById(props.scrollTo).offsetTop);
    }
  }, [props]);
  return (
    <div>
      <Panel
        style={{
          textAlign: 'center',
        }}
        header={<h3>Utilities</h3>}
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
      <FlexboxGrid
        justify="space-around"
        style={{
          textAlign: 'center',
        }}
      >
        {categories.map((x, i) => (
          <Fragment key={i}>
            <FlexboxGrid.Item colspan={24} id={x}>
              <Divider>{x}</Divider>
            </FlexboxGrid.Item>
            {packages
              .filter(y => y.category === x)
              .map((y, j) => (
                <FlexboxGrid.Item key={j}>
                  <Panel
                    shaded
                    bordered
                    bodyFill
                    style={{
                      width: 300,
                    }}
                  >
                    <img src={y.img} height={200} width={200} />
                    <Panel
                      header={
                        <>
                          {y.name}
                          <br />
                          {y.tags}
                          <Divider />
                          <ButtonGroup justified>
                            <Button
                              appearance="ghost"
                              onClick={() => {
                                setPkg(y);
                                setShowConfirmation(true);
                              }}
                            >
                              {y.installed ? 'Un-Install' : 'Install'}
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
                        {y.description}
                      </p>
                    </Panel>
                  </Panel>
                </FlexboxGrid.Item>
              ))}
          </Fragment>
        ))}
      </FlexboxGrid>
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
                    origin: <RenderUtilities />,
                    terminal: true,
                  });
                  return new Notification('Installation Started!', {
                    icon: '/icon.png',
                    body: `Installation started for: ${pkg.name}`,
                  });
                }
                dispatch({
                  type: 'UnInstallationUpdate',
                  status: true,
                  name: pkg.name,
                  deps: pkg.deps,
                  goto: <RenderInstallation />,
                  origin: <RenderUtilities />,
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
    </div>
  );
}
