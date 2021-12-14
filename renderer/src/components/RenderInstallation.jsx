import {ipcRenderer} from 'electron';
import Panel from 'rsuite/Panel';
import Divider from 'rsuite/Divider';
import Grid from 'rsuite/Grid';
import Row from 'rsuite/Row';
import React, {useEffect} from 'react';
import {useGlobalStore} from '../utils/store';
import Terminal from './Terminal';

/**
 * @function RenderInstallation
 * @author SoulHarsh007 <harsh.peshwani@outlook.com>
 * @copyright SoulHarsh007 2021
 * @since v1.0.0-Pre-Alpha
 * @description Used for rendering Active Installation
 * @returns {import('react').JSXElementConstructor} - React Body
 */
export default function RenderInstallation() {
  const {state, dispatch} = useGlobalStore();
  useEffect(() => {
    if (state.activeTasks) {
      ipcRenderer.once('termExit', (_, data) => {
        const exitCode = data.signal || data.exitCode;
        const status = exitCode ? 'failed' : 'completed';
        dispatch({
          type: 'InstallationUpdate',
          status: false,
          deps: [],
          name: state.packageName,
          goto: <RenderInstallation />,
          origin: state.origin,
          terminal: true,
        });
        switch (state.activeTaskType) {
          case 'installing':
            return new Notification(`Installation ${status}!`, {
              icon: '/icon.png',
              body: `Installation ${status} for: ${state.packageName}`,
            });
          case 'un-installing':
            return new Notification(`Un-Installation ${status}!`, {
              icon: '/icon.png',
              body: `Un-Installation ${status} for: ${state.packageName}`,
            });
          case 'enabling':
            return new Notification(`Enabling ${status}!`, {
              icon: '/icon.png',
              body: `Enabling ${status} for: ${state.packageName}`,
            });
          default:
            return;
        }
      });
    }
  }, [
    state.packageDeps,
    state.packageName,
    state.activeTasks,
    state.origin,
    dispatch,
    state.activeTaskType,
  ]);
  return (
    <Grid fluid>
      <Row>
        <Panel
          style={{
            textAlign: 'center',
          }}
          header={
            <h3>
              You are {state.activeTaskType}: {state.packageName}
            </h3>
          }
          bodyFill
        />
      </Row>
      <Divider />
      <Row>
        <Terminal />
        <Divider />
      </Row>
    </Grid>
  );
}
