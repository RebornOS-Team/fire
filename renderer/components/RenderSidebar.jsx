import {Sidebar, Nav, Sidenav} from 'rsuite';
import {
  RenderAppearance,
  RenderDMS,
  RenderDashboard,
  RenderSM,
  RenderUtilities,
} from '../components';
import {useContext, useState} from 'react';
import {Context} from '../utils/store';

/**
 * @function RenderSidebar
 * @author SoulHarsh007 <harshtheking@hotmail.com>
 * @copyright SoulHarsh007 2021
 * @since v1.0.0-Beta
 * @description Used for rendering Sidebar
 * @returns {import('react').JSXElementConstructor} - React Body
 */
export function RenderSidebar() {
  const {state, dispatch} = useContext(Context);
  const [activeKey, setActiveKey] = useState('1');
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
        <Sidenav
          expanded={true}
          activeKey={activeKey}
          onSelect={key => {
            setActiveKey(key);
            switch (key) {
              case '1':
                dispatch({
                  type: 'ContentUpdate',
                  newContent: <RenderDashboard />,
                });
                break;
              case '2':
                dispatch({
                  type: 'ContentUpdate',
                  newContent: <RenderAppearance />,
                });
                break;
              case '3':
                dispatch({
                  type: 'ContentUpdate',
                  newContent: <RenderDMS />,
                });
                break;
              case '4':
                dispatch({
                  type: 'ContentUpdate',
                  newContent: <RenderUtilities />,
                });
                break;
              case '5':
                dispatch({
                  type: 'ContentUpdate',
                  newContent: <RenderSM />,
                });
                break;
              default:
                break;
            }
          }}
        >
          <Sidenav.Header>
            <div
              style={{
                padding: 18,
                fontSize: 24,
                height: 56,
                color: '#fff',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
              }}
            >
              <i>
                <img
                  className="rs-icon rs-icon-size-3x"
                  src="/rebornos-fire-new.svg"
                  height={44}
                  width={44}
                  alt=""
                />
              </i>
              <span
                style={{
                  marginLeft: 12,
                  marginBottom: 14,
                }}
              >
                {' RebornOS Fire'}
              </span>
            </div>
          </Sidenav.Header>
          <hr />
          <Sidenav.Body>
            <Nav>
              <Nav.Item eventKey="1" disabled={state.activeTasks}>
                Dashboard
              </Nav.Item>
              <Nav.Item eventKey="2" disabled={state.activeTasks}>
                Desktops
              </Nav.Item>
              <Nav.Item eventKey="3" disabled={state.activeTasks}>
                Display Managers
              </Nav.Item>
              <Nav.Item
                eventKey="4"
                disabled={state.activeTasks}
                style={{
                  display: 'none',
                }}
              >
                Utilities
              </Nav.Item>
              <Nav.Item
                eventKey="5"
                disabled={state.activeTasks}
                style={{
                  display: 'none',
                }}
              >
                System Maintenance
              </Nav.Item>
            </Nav>
          </Sidenav.Body>
        </Sidenav>
      </Sidebar>
    </div>
  );
}
