import {ipcRenderer} from 'electron';
import {Panel, Grid, Col, Row, Divider} from 'rsuite';
import React, {useEffect} from 'react';
import {useGlobalStore} from '../utils/store';
import Terminal from './Terminal';

/**
 * @function RenderEnable
 * @author SoulHarsh007 <harshtheking@hotmail.com>
 * @copyright SoulHarsh007 2021
 * @since v1.0.0-Pre-Alpha
 * @description Used for rendering Active Installation
 * @returns {import('react').JSXElementConstructor} - React Body
 */
export function RenderEnable() {
  const {state, dispatch} = useGlobalStore();
  useEffect(() => {
    if (!state.activeTasks) {
      return;
    }
    ipcRenderer.send('termExec', state.enable.packageDeps);
    ipcRenderer.once('termExit', (_event, data) => {
      dispatch({
        type: 'EnableUpdate',
        status: false,
        deps: [],
        name: state.packageName,
        goto: <RenderEnable />,
        origin: state.origin,
        terminal: true,
      });
      new Notification(
        `Enabling ${data.signal || data.exitCode ? 'failed' : 'completed'}!`,
        {
          icon: '/icon.png',
          body: `Enabling ${
            data.signal || data.exitCode ? 'failed' : 'completed'
          } for: ${state.packageName}`,
        }
      );
    });
  }, [
    state.enable.packageDeps,
    state.packageName,
    state.origin,
    state.activeTasks,
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
          header={<h3>You are enabling: {state.packageName}</h3>}
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
