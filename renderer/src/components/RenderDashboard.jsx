import FlexboxGrid from 'rsuite/FlexboxGrid';
import Panel from 'rsuite/Panel';
import Divider from 'rsuite/Divider';
import React, {useState, useEffect} from 'react';
import {release, cpus, hostname, userInfo, totalmem} from 'os';
import {readlinkSync, readFileSync} from 'fs';
import ReloadBar from './ReloadBar';
import {ipcRenderer} from 'electron';

/**
 * @function RenderDashboard
 * @author SoulHarsh007 <harsh.peshwani@outlook.com>
 * @copyright SoulHarsh007 2021
 * @since v1.0.0-Pre-Alpha
 * @description Used for rendering Dashboard
 * @returns {import('react').JSXElementConstructor} - React Body
 */
export default function RenderDashboard() {
  const [sysInfo, setSysInfo] = useState({
    'Host Name': 'fetching info...',
    'CPU Model': 'fetching info...',
    'User Name': 'fetching info...',
    'User Shell': 'fetching info...',
    'Memory Available': 'fetching info...',
    'Kernel Release': 'fetching info...',
    'Display Manager': 'fetching info...',
  });
  const [reload, setReload] = useState(true);
  useEffect(() => {
    if (reload) {
      const user = userInfo();
      let enabled = 'TTY';
      try {
        enabled = readlinkSync('/etc/systemd/system/display-manager.service')
          ?.match(/[a-z]*\.service/g)?.[0]
          ?.split('.')?.[0]
          ?.toLowerCase();
      } catch (e) {
        ipcRenderer.send('debug', e);
      }
      setSysInfo({
        'Host Name': hostname(),
        'CPU Model': `${cpus()[0].model} (${process.arch})`,
        'User Name': `${user.username} (${user.uid})`,
        'User Shell': user.shell,
        'Memory Available': `${(
          readFileSync('/proc/meminfo')
            .toString('utf8')
            .match(/MemAvailable:.*/g)?.[0]
            .match(/\d+/g)?.[0] / 1024
        ).toFixed(2)} MiB / ${(totalmem() / (1024 * 1024)).toFixed(2)} MiB`,
        'Kernel Release': release(),
        'Display Manager': enabled,
      });
      setReload(false);
    }
  }, [reload]);
  return (
    <>
      <Panel
        style={{
          textAlign: 'center',
        }}
        header={<h3>Welcome to RebornOS Fire!</h3>}
        bodyFill
      />
      <ReloadBar
        action={() => {
          setSysInfo({
            'Host Name': 'fetching info...',
            'CPU Model': 'fetching info...',
            'User Name': 'fetching info...',
            'User Shell': 'fetching info...',
            'Memory Available': 'fetching info...',
            'Kernel Release': 'fetching info...',
            'Display Manager': 'fetching info...',
          });
          setReload(true);
        }}
        pulseState={reload}
        text={'Reload'}
      />
      <div
        style={{
          textAlign: 'center',
        }}
      >
        <h4>System Information:</h4>
      </div>
      <Divider />
      <div
        style={{
          textAlign: 'center',
        }}
      >
        {Object.keys(sysInfo).map((x, i) => (
          <FlexboxGrid
            key={i}
            justify="space-between"
            style={{
              paddingLeft: '10px',
              paddingRight: '30px',
            }}
          >
            <FlexboxGrid.Item>
              <h4>{x}:</h4>
            </FlexboxGrid.Item>
            <FlexboxGrid.Item>
              {/* Not affected as, all keys are strings! */
              /* eslint-disable-next-line security/detect-object-injection */}
              <h4>{sysInfo[x]}</h4>
            </FlexboxGrid.Item>
          </FlexboxGrid>
        ))}
      </div>
    </>
  );
}
