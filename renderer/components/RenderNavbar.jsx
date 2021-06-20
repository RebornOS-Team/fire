import {Nav, Icon, Navbar, Header} from 'rsuite';
import {Context} from '../utils/store';
import {useContext} from 'react';

/**
 * @function RenderNavbar
 * @author SoulHarsh007 <harshtheking@hotmail.com>
 * @copyright SoulHarsh007 2021
 * @since v1.0.0-Beta
 * @description Used for rendering Navbar
 * @returns {import('react').JSXElementConstructor} - React Body
 */
export function RenderNavbar() {
  const {dispatch} = useContext(Context);
  return (
    <Header>
      <Navbar>
        <Navbar.Body>
          <Nav pullRight>
            <Nav.Item
              icon={<Icon icon="info" />}
              onSelect={() =>
                dispatch({
                  type: 'AboutModal',
                })
              }
            >
              About
            </Nav.Item>
          </Nav>
        </Navbar.Body>
      </Navbar>
    </Header>
  );
}
