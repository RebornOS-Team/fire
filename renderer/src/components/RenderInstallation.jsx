import {ipcRenderer} from 'electron';
import {Panel, Grid, Col, Row, Divider} from 'rsuite';
import React, {useEffect} from 'react';
import {useGlobalStore} from '../utils/store';
import Terminal from './Terminal';

/**
 * @function RenderInstallation
 * @author SoulHarsh007 <harshtheking@hotmail.com>
 * @copyright SoulHarsh007 2021
 * @since v1.0.0-Pre-Alpha
 * @description Used for rendering Active Installation
 * @returns {import('react').JSXElementConstructor} - React Body
 */
export function RenderInstallation() {
  const {state, dispatch} = useGlobalStore();
  useEffect(() => {
    if (!state.activeTasks) {
      return;
    }
    ipcRenderer.once('termExit', (_event, data) => {
      new Notification(
        `Installation ${
          data.signal || data.exitCode ? 'failed' : 'completed'
        }!`,
        {
          icon: '/icon.png',
          body: `Installation ${
            data.signal || data.exitCode ? 'failed' : 'completed'
          } for: ${state.packageName}`,
        }
      );
      dispatch({
        type: 'InstallationUpdate',
        status: false,
        deps: [],
        name: state.packageName,
        goto: <RenderInstallation />,
        origin: state.origin,
        terminal: true,
      });
    });
  }, [
    state.packageDeps,
    state.packageName,
    state.activeTasks,
    state.origin,
    dispatch,
  ]);
  return (
    <Grid
      fluid
      style={{
        textAlign: 'center',
      }}
    >
      <Row>
        <Panel
          header={<h3>You are installing: {state.packageName}</h3>}
          bodyFill
        />
      </Row>
      <Divider />
      <Row>
        <Col>
          <Terminal />
        </Col>
        <Divider />
      </Row>
    </Grid>
  );
}
