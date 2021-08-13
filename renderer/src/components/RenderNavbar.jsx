import {Nav, Icon, Navbar, Header} from 'rsuite';
import {useGlobalStore} from '../utils/store';
import React from 'react';

/**
 * @function RenderNavbar
 * @author SoulHarsh007 <harshtheking@hotmail.com>
 * @copyright SoulHarsh007 2021
 * @since v1.0.0-Pre-Alpha
 * @description Used for rendering Navbar
 * @returns {import('react').JSXElementConstructor} - React Body
 */
export function RenderNavbar() {
  const {dispatch} = useGlobalStore();
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
