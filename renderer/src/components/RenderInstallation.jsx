import {ipcRenderer} from 'electron';
import {Panel, Grid, Col, Row, Divider} from 'rsuite';
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
export function RenderInstallation() {
  const {state, dispatch} = useGlobalStore();
  useEffect(() => {
    if (!state.activeTasks) {
      return;
    }
    ipcRenderer.once('termExit', (_event, data) => {
      const exitCode = data.signal || data.exitCode;
      switch (state.activeTaskType) {
        case 'installing':
          new Notification(
            `Installation ${exitCode ? 'failed' : 'completed'}!`,
            {
              icon: '/icon.png',
              body: `Installation ${exitCode ? 'failed' : 'completed'} for: ${
                state.packageName
              }`,
            }
          );
          break;
        case 'un-installing':
          new Notification(
            `Un-Installation ${exitCode ? 'failed' : 'completed'}!`,
            {
              icon: '/icon.png',
              body: `Un-Installation ${
                exitCode ? 'failed' : 'completed'
              } for: ${state.packageName}`,
            }
          );
          break;
        case 'enabling':
          new Notification(`Enabling ${exitCode ? 'failed' : 'completed'}!`, {
            icon: '/icon.png',
            body: `Enabling ${exitCode ? 'failed' : 'completed'} for: ${
              state.packageName
            }`,
          });
          break;
        default:
          break;
      }
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
        <Col>
          <Terminal />
        </Col>
        <Divider />
      </Row>
    </Grid>
  );
}
