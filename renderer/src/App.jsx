import './css/global.css';
import 'rsuite/dist/styles/rsuite-dark.css';
import {ipcRenderer} from 'electron';
import React, {useEffect} from 'react';
import {useGlobalStore} from './utils/store';
import {Container, Content} from 'rsuite';
import {
  RenderAbout,
  RenderNavbar,
  RenderSidebar,
  NetworkDetection,
} from './components';

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
    ipcRenderer.send('Loaded');
    ipcRenderer.send('debug', 'Index page loaded');
  }, []);
  return (
    <Container>
      <NetworkDetection />
      <Container>
        <RenderSidebar />
        <Container>
          <RenderNavbar />
          <Content>{state.content}</Content>
          {state.terminal && (
            <div
              id="terminal"
              style={{
                paddingTop: 20,
              }}
            />
          )}
        </Container>
      </Container>
      <RenderAbout />
    </Container>
  );
}
