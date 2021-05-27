import {Panel, Grid, Row, Divider, Nav, Navbar, FlexboxGrid} from 'rsuite';
import Icon from 'rsuite/lib/Icon/Icon';
import {useState, useEffect} from 'react';
import {release, cpus, hostname, userInfo, freemem, totalmem} from 'os';

/**
 * @function RenderDashboard
 * @author SoulHarsh007 <harshtheking@hotmail.com>
 * @copyright SoulHarsh007 2021
 * @since v1.0.0-Beta
 * @description Used for rendering Dashboard
 * @returns {import('react').JSXElementConstructor} - React Body
 */
export function RenderDashboard() {
  const [sysInfo, setSysInfo] = useState({
    Host_Name: 'fetching info...',
    CPU_Model: 'fetching info...',
    User_Name: 'fetching info...',
    User_Shell: 'fetching info...',
    Memory_Available: 'fetching info...',
    Kernel_Release: 'fetching info...',
  });
  useEffect(() => {
    const user = userInfo();
    setSysInfo({
      Host_Name: hostname(),
      CPU_Model: cpus()[0].model,
      User_Name: `${user.username} (${user.uid})`,
      User_Shell: user.shell,
      Memory_Available: `${(freemem() / (1024 * 1024)).toFixed(2)} MiB / ${(
        totalmem() /
        (1024 * 1024)
      ).toFixed(2)} MiB`,
      Kernel_Release: release(),
    });
  }, []);
  return (
    <Grid
      fluid
      style={{
        textAlign: 'center',
      }}
    >
      <Row>
        <Panel header={<h3>Welcome to RebornOS Fire!</h3>} bodyFill></Panel>
      </Row>
      <Navbar>
        <Navbar.Body>
          <Nav pullRight appearance="subtle" activeKey="1">
            <Nav.Item
              icon={<Icon icon="refresh" pulse={false} />}
              eventKey="1"
              onSelect={() => {}}
            >
              Reload
            </Nav.Item>
          </Nav>
        </Navbar.Body>
      </Navbar>
      <Divider />
      <Row
        style={{
          textAlign: 'center',
        }}
      >
        <h4>System Information:</h4>
      </Row>
      <Divider />
      <Row
        style={{
          textAlign: 'center',
        }}
      >
        {Object.keys(sysInfo).map((x, i) => (
          <FlexboxGrid
            key={i}
            justify="space-between"
            style={{
              paddingLeft: '10px',
              paddingRight: '30px',
            }}
          >
            <FlexboxGrid.Item>
              <h4>{x.split('_').join(' ')}:</h4>
            </FlexboxGrid.Item>
            <FlexboxGrid.Item>
              <h4>{sysInfo[x]}</h4>
            </FlexboxGrid.Item>
          </FlexboxGrid>
        ))}
      </Row>
    </Grid>
  );
}
