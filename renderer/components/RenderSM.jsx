import {Panel, Grid, Row} from 'rsuite';

/**
 * @function RenderSM
 * @author SoulHarsh007 <harshtheking@hotmail.com>
 * @copyright SoulHarsh007 2021
 * @since v1.0.0-Beta
 * @description Used for rendering System Management
 * @returns {import('react').JSXElementConstructor} - React Body
 */
export function RenderSM() {
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
