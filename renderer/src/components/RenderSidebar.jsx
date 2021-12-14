import Sidebar from 'rsuite/Sidebar';
import Nav from 'rsuite/Nav';
import Sidenav from 'rsuite/Sidenav';
import Dropdown from 'rsuite/Dropdown';
import RenderAppearance from './RenderAppearance';
import RenderDMS from './RenderDMS';
import RenderDashboard from './RenderDashboard';
import RenderTweaks from './RenderTweaks';
import RenderUtilities from './RenderUtilities';
import RenderKernels from './RenderKernels';
import React, {useEffect, useState, useCallback} from 'react';
import {useGlobalStore} from '../utils/store';
import {ipcRenderer} from 'electron';

/**
 * @function RenderSidebar
 * @author SoulHarsh007 <harsh.peshwani@outlook.com>
 * @copyright SoulHarsh007 2021
 * @since v1.0.0-Pre-Alpha
 * @description Used for rendering Sidebar
 * @returns {import('react').JSXElementConstructor} - React Body
 */
export default function RenderSidebar() {
  const {state, dispatch} = useGlobalStore();
  const [activeKey, setActiveKey] = useState('1');
  const handleSelection = useCallback(
    key => {
      setActiveKey(key);
      const handleDispatch = newContent =>
        dispatch({
          type: 'ContentUpdate',
          newContent,
          terminal: false,
        });
      switch (key) {
        case '1':
          handleDispatch(<RenderDashboard />);
          break;
        case '2':
          handleDispatch(<RenderAppearance />);
          break;
        case '3':
          handleDispatch(<RenderDMS />);
          break;
        case '4':
          handleDispatch(<RenderUtilities />);
          break;
        case '4-1':
          handleDispatch(<RenderUtilities scrollTo="Office" />);
          break;
        case '4-2':
          handleDispatch(<RenderUtilities scrollTo="Gaming" />);
          break;
        case '4-3':
          handleDispatch(<RenderUtilities scrollTo="Browsers" />);
          break;
        case '4-4':
          handleDispatch(<RenderUtilities scrollTo="Music" />);
          break;
        case '4-5':
          handleDispatch(<RenderUtilities scrollTo="Video" />);
          break;
        case '4-6':
          handleDispatch(<RenderUtilities scrollTo="Developer" />);
          break;
        case '5':
          handleDispatch(<RenderKernels />);
          break;
        case '6':
          handleDispatch(<RenderTweaks />);
          break;
        default:
          break;
      }
    },
    [dispatch]
  );
  useEffect(() => {
    const handler = (_, page) => handleSelection(page);
    ipcRenderer.once('Goto', handler);
    return ipcRenderer.removeListener('Goto', handler);
  }, [handleSelection]);
  return (
    <div
      style={{
        width: 275,
      }}
    >
      <Sidebar
        style={{
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Sidenav expanded appearance="subtle">
          <Sidenav.Body>
            <Nav activeKey={activeKey} onSelect={handleSelection}>
              <Nav.Item eventKey="1" disabled={state.activeTasks}>
                Dashboard
              </Nav.Item>
              <Nav.Item eventKey="2" disabled={state.activeTasks}>
                Desktops
              </Nav.Item>
              <Nav.Item eventKey="3" disabled={state.activeTasks}>
                Display Managers
              </Nav.Item>
              <Dropdown
                eventKey="4"
                disabled={state.activeTasks}
                title="Utilities"
                onToggle={open => {
                  if (!state.activeTasks && open) {
                    handleSelection('4');
                  }
                }}
                onSelect={e => {
                  if (!state.activeTasks) {
                    handleSelection(e);
                  }
                }}
              >
                <Dropdown.Item eventKey="4-1" disabled={state.activeTasks}>
                  Office
                </Dropdown.Item>
                <Dropdown.Item eventKey="4-2" disabled={state.activeTasks}>
                  Gaming
                </Dropdown.Item>
                <Dropdown.Item eventKey="4-3" disabled={state.activeTasks}>
                  Browsers
                </Dropdown.Item>
                <Dropdown.Item eventKey="4-4" disabled={state.activeTasks}>
                  Music
                </Dropdown.Item>
                <Dropdown.Item eventKey="4-5" disabled={state.activeTasks}>
                  Video
                </Dropdown.Item>
                <Dropdown.Item eventKey="4-6" disabled={state.activeTasks}>
                  Developer
                </Dropdown.Item>
              </Dropdown>
              <Nav.Item eventKey="5" disabled={state.activeTasks}>
                Kernel Management
              </Nav.Item>
              <Nav.Item eventKey="6" disabled={state.activeTasks}>
                System Tweaks
              </Nav.Item>
            </Nav>
          </Sidenav.Body>
        </Sidenav>
      </Sidebar>
    </div>
  );
}
