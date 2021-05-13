import {Panel, Grid, Row} from 'rsuite';

/**
 * @function RenderDMS
 * @author SoulHarsh007 <harshtheking@hotmail.com>
 * @copyright SoulHarsh007 2021
 * @since v1.0.0-Beta
 * @description Used for rendering Display Managers
 * @returns {import('react').JSXElementConstructor} - React Body
 */
export function RenderDMS() {
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
    </Grid>
  );
}
