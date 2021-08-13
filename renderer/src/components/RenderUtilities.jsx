import {Panel, Grid, Row} from 'rsuite';
import React from 'react';

/**
 * @function RenderUtilities
 * @author SoulHarsh007 <harshtheking@hotmail.com>
 * @copyright SoulHarsh007 2021
 * @since v1.0.0-Pre-Alpha
 * @description Used for rendering Utilities
 * @returns {import('react').JSXElementConstructor} - React Body
 */
export function RenderUtilities() {
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
