/* eslint-disable react/prop-types */
import {
  Panel,
  Divider,
  Button,
  ButtonGroup,
  FlexboxGrid,
  Navbar,
  Nav,
  Icon,
  Modal,
} from 'rsuite';
import React, {useState, useEffect, Fragment} from 'react';
import {execSync} from 'child_process';
import {useGlobalStore} from '../utils/store';
import {RenderInstallation} from './RenderInstallation';

/**
 * @function RenderUtilities
 * @author SoulHarsh007 <harsh.peshwani@outlook.com>
 * @copyright SoulHarsh007 2021
 * @since v1.0.0-Pre-Alpha
 * @description Used for rendering Utilities
 * @param {{scrollTo?: string}} props - props for the component
 * @returns {import('react').JSXElementConstructor} - React Body
 */
export function RenderUtilities(props) {
  const {dispatch} = useGlobalStore();
  const [categories] = useState([
    'Office',
    'Gaming',
    'Browsers',
    'Music',
    'Video',
    'Developer',
  ]);
  const [refresh, setRefresh] = useState({
    loading: true,
    text: 'Reloading',
  });
  const [scanPackages, setScanPackages] = useState(true);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pkg, setPkg] = useState({});
  const [packages, setPackages] = useState([
    {
      name: 'WPS Office',
      img: '/wps-office.webp',
      tags: [],
      installed: false,
      match: /^wps-office(-cn)?$/gm,
      category: 'Office',
      deps: ['wps-office'],
      description:
        'Kingsoft Office (WPS Office) - an office productivity suite',
    },
    {
      name: 'Libre Office (Fresh)',
      img: '/libreoffice.webp',
      tags: [],
      installed: false,
      match: /^libreoffice-(fresh|still|dev-bin)$/gm,
      category: 'Office',
      deps: ['libreoffice-fresh'],
      description:
        'LibreOffice branch which contains new features and program enhancements',
    },
    {
      name: 'Free Office',
      img: '/freeoffice.webp',
      tags: [],
      installed: false,
      match: /^freeoffice$/gm,
      category: 'Office',
      deps: ['freeoffice'],
      description:
        'A complete, reliable, lightning-fast and Microsoft Office-compatible office suite with a word processor, spreadsheet, and presentation graphics software',
    },
    {
      name: 'Calligra',
      img: '/calligra.webp',
      tags: [],
      installed: false,
      match: /^calligra(-git)?$/gm,
      category: 'Office',
      deps: ['calligra'],
      description: 'A set of applications for productivity and creative usage',
    },
    {
      name: 'Steam',
      img: '/steam.webp',
      tags: [],
      installed: false,
      match: /^steam$/gm,
      category: 'Gaming',
      deps: ['steam'],
      description: "Valve's digital software delivery system",
    },
    {
      name: 'Discord',
      img: '/discord.webp',
      tags: [],
      installed: false,
      match: /^discord(-canary)?$/gm,
      category: 'Gaming',
      deps: ['discord'],
      description:
        "All-in-one voice and text chat for gamers that's free and secure",
    },
    {
      name: 'Wine',
      img: '/wine.webp',
      tags: [],
      installed: false,
      match: /^wine(-(git|staging))?$/gm,
      category: 'Gaming',
      deps: ['wine'],
      description: 'A compatibility layer for running Windows programs',
    },
    {
      name: 'Firefox',
      img: '/firefox.webp',
      tags: [],
      installed: false,
      match: /^firefox(-bin)?$/gm,
      category: 'Browsers',
      deps: ['firefox'],
      description: 'Standalone web browser from mozilla.org',
    },
    {
      name: 'Brave',
      img: '/brave.webp',
      tags: [],
      installed: false,
      match: /^brave(-(bin|beta-bin|dev-bin|git|nightly-bin))?$/gm,
      category: 'Browsers',
      deps: ['brave-bin'],
      description: 'Web browser that blocks ads and trackers by default',
    },
    {
      name: 'Chromium',
      img: '/chromium.webp',
      tags: [],
      installed: false,
      match: /^chromium(-(snapshot-bin|dev))?$/gm,
      category: 'Browsers',
      deps: ['chromium'],
      description: 'A web browser built for speed, simplicity, and security',
    },
    {
      name: 'Google Chrome',
      img: '/google-chrome.webp',
      tags: [],
      installed: false,
      match: /^google-chrome(-(beta|dev))?$/gm,
      category: 'Browsers',
      deps: ['google-chrome'],
      description:
        'The popular and trusted web browser by Google (Stable Channel)',
    },
    {
      name: 'Spotify',
      img: '/spotify.webp',
      tags: [],
      installed: false,
      match: /^spotify(-(snap|dev))?$/gm,
      category: 'Music',
      deps: ['spotify'],
      description: 'A proprietary music streaming service',
    },
    {
      name: 'Gnome Music',
      img: '/gnome-music.webp',
      tags: [],
      installed: false,
      match: /^gnome-music(-git)?$/gm,
      category: 'Music',
      deps: ['gnome-music'],
      description: 'Music player and management application',
    },
    {
      name: 'VLC',
      img: '/vlc.webp',
      tags: [],
      installed: false,
      match: /^vlc(-git)?$/gm,
      category: 'Video',
      deps: ['vlc'],
      description: 'Multi-platform MPEG, VCD/DVD, and DivX player',
    },
    {
      name: 'Code - OSS',
      img: '/code.webp',
      tags: [],
      installed: false,
      match: /^code(-git)?$/gm,
      category: 'Developer',
      deps: ['code'],
      description:
        'The Open Source build of Visual Studio Code (vscode) editor',
    },
    {
      name: 'Android Studio',
      img: '/android-studio.webp',
      tags: [],
      installed: false,
      match: /^android-studio(-(canary|beta|dummy))?$/gm,
      category: 'Developer',
      deps: ['android-studio'],
      description: 'The official Android IDE (Stable branch)',
    },
  ]);
  useEffect(() => {
    const scanned = execSync('pacman -Qq').toString();
    setPackages(x =>
      x.map(y =>
        scanned.match(y.match)?.length
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
  if (props.scrollTo) {
    window.scrollTo(0, document.getElementById(props.scrollTo).offsetTop);
  }
  return (
    <div>
      <Panel
        style={{
          textAlign: 'center',
        }}
        header={<h3>Utilities</h3>}
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
                new Notification('Un-Installation Started!', {
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
