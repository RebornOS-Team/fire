import {ipcRenderer} from 'electron';
import {useContext, useEffect} from 'react';
import {Container, Content} from 'rsuite';
import {
  RenderAbout,
  RenderNavbar,
  RenderSidebar,
  NetworkDetection,
} from '../components';
import {Context} from '../utils/store';

/**
 * @function Index
 * @author SoulHarsh007 <harshtheking@hotmail.com>
 * @copyright SoulHarsh007 2021
 * @since v1.0.0-Beta
 * @description Index page
 * @returns {import('react').JSXElementConstructor} - React Body
 */
export default function Index() {
  const {state} = useContext(Context);
  useEffect(() => {
    ipcRenderer.invoke('StateChange', state.activeTasks);
  }, [state.activeTasks]);
  return (
    <Container>
      <NetworkDetection />
      <Container>
        <RenderSidebar />
        <Container>
          <RenderNavbar />
          <Content>{state.content}</Content>
        </Container>
      </Container>
      <RenderAbout />
    </Container>
  );
}
