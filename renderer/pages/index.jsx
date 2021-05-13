import {Container, Content} from 'rsuite';
import {RenderAbout, RenderNavbar, RenderSidebar} from '../components';
import {Context} from '../utils/store';
import {useContext} from 'react';

/**
 * @function Index
 * @author SoulHarsh007 <harshtheking@hotmail.com>
 * @copyright SoulHarsh007 2021
 * @since v1.0.0-Beta
 * @description Index page
 * @returns {import('react').JSXElementConstructor} - React Body
 */
export default function Index() {
  const [state] = useContext(Context);
  return (
    <Container>
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
