import Nav from 'rsuite/Nav';
import Navbar from 'rsuite/Navbar';
import Header from 'rsuite/Header';
import LegacyInfoIcon from '@rsuite/icons/legacy/Info';
import LegacyCogIcon from '@rsuite/icons/legacy/Cog';
import {useGlobalStore} from '../utils/store';
import Settings from './RenderSettings.jsx';
import React from 'react';

/**
 * @function RenderNavbar
 * @author SoulHarsh007 <harsh.peshwani@outlook.com>
 * @copyright SoulHarsh007 2021
 * @since v1.0.0-Pre-Alpha
 * @description Used for rendering Navbar
 * @returns {import('react').JSXElementConstructor} - React Body
 */
export default function RenderNavbar() {
  const {state, dispatch} = useGlobalStore();
  return (
    <Header>
      <Navbar appearance="subtle">
        <i>
          <img
            src="/rebornos-fire.svg"
            style={{
              height: '1em',
              width: '1em',
              fontSize: '4em',
            }}
          />
        </i>
        <span
          style={{
            fontSize: '2em',
            fontStyle: 'normal',
            position: 'absolute',
            marginTop: '0.2em',
            marginLeft: '0.1em',
          }}
        >
          RebornOS Fire
        </span>
        <Nav pullRight>
          <Nav.Item
            icon={<LegacyInfoIcon />}
            onSelect={() =>
              dispatch({
                type: 'AboutModal',
              })
            }
          >
            {' About'}
          </Nav.Item>
          <Nav.Item
            icon={<LegacyCogIcon />}
            disabled={state.activeTasks}
            onSelect={() =>
              dispatch({
                type: 'ContentUpdate',
                newContent: <Settings />,
                terminal: false,
              })
            }
          >
            {' Settings'}
          </Nav.Item>
        </Nav>
      </Navbar>
    </Header>
  );
}
