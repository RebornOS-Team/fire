import './css/global.css';
import 'rsuite/dist/rsuite.min.css';
import {ipcRenderer} from 'electron';
import React, {useEffect} from 'react';
import {useGlobalStore} from './utils/store';
import Container from 'rsuite/Container';
import Content from 'rsuite/Content';
import CustomProvider from 'rsuite/CustomProvider';
import RenderAbout from './components/RenderAbout';
import RenderNavbar from './components/RenderNavbar';
import RenderSidebar from './components/RenderSidebar';
import NetworkDetection from './components/NetworkDetection';
import PacmanLockDetection from './components/PacmanLockDetection';
import InvalidConfigDetection from './components/InvalidConfigDetection';
import updater from './utils/updater';
import modules from './utils/modules';

/**
 * @function App
 * @author SoulHarsh007 <harsh.peshwani@outlook.com>
 * @copyright SoulHarsh007 2021
 * @since v1.0.0-Pre-Alpha
 * @returns {any} main rendering component
 */
export default function App() {
  const {state} = useGlobalStore();
  useEffect(() => {
    ipcRenderer.send('StateChange', state.activeTasks);
  }, [state.activeTasks]);
  useEffect(() => {
    window.ondragstart = () => false;
    ipcRenderer.send('Loaded');
    ipcRenderer.send('debug', 'Index page loaded');
    ipcRenderer.once('update', () => {
      updater()
        .then(status => {
          ipcRenderer.send(
            'log',
            status
              ? `Modules updated to v${modules.get('version')}`
              : 'Modules are upto date!',
            'INFO',
            'RebornOS Fire Renderer'
          );
        })
        .catch(e => {
          ipcRenderer.send(
            'log',
            `Error while looking for updates: ${e.message}`
          );
          ipcRenderer.send('debug', e);
        });
    });
  }, []);
  return (
    <CustomProvider theme={'dark'}>
      <Container>
        <Container>
          <InvalidConfigDetection />
          <PacmanLockDetection />
          <NetworkDetection />
          <RenderNavbar />
          <Container>
            <RenderSidebar />
            <Content>
              {state.content}
              {state.terminal && (
                <div
                  id="terminal"
                  style={{
                    paddingTop: 20,
                  }}
                />
              )}
            </Content>
          </Container>
        </Container>
        <RenderAbout />
      </Container>
    </CustomProvider>
  );
}
