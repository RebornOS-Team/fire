/* eslint-disable react/prop-types */
import Nav from 'rsuite/Nav';
import Navbar from 'rsuite/Navbar';
import Divider from 'rsuite/Divider';
import ReloadIcon from '@rsuite/icons/Reload';
import React from 'react';

/**
 * @author SoulHarsh007 <harsh.peshwani@outlook.com>
 * @param {{action: Function, pulseState: boolean, text: string}} props - props for the component
 * @returns {any} Right reload bar
 */
export default function ReloadBar(props) {
  return (
    <>
      <Navbar appearance="subtle">
        <Nav pullRight appearance="subtle" activeKey="1">
          <Nav.Item
            icon={<ReloadIcon pulse={props.pulseState} />}
            eventKey="1"
            onClick={() => props?.action()}
          >
            {` ${props.text}`}
          </Nav.Item>
        </Nav>
      </Navbar>
      <Divider />
    </>
  );
}
