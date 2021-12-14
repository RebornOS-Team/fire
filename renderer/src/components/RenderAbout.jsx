import React from 'react';
import Modal from 'rsuite/Modal';
import FlexboxGrid from 'rsuite/FlexboxGrid';
import Button from 'rsuite/Button';
import {shell} from 'electron';
import {useGlobalStore} from '../utils/store';

/**
 * @function RenderAbout
 * @author SoulHarsh007 <harsh.peshwani@outlook.com>
 * @copyright SoulHarsh007 2021
 * @since v1.0.0-Pre-Alpha
 * @description Used for rendering About software information
 * @returns {import('react').JSXElementConstructor} - React Body
 */
export default function RenderAbout() {
  const {state, dispatch} = useGlobalStore();
  return (
    <FlexboxGrid align="middle" justify="center">
      <Modal
        size="xs"
        open={state.showAboutModal}
        onClose={() =>
          dispatch({
            type: 'AboutModal',
          })
        }
        style={{
          textAlign: 'center',
        }}
      >
        <Modal.Header closeButton />
        <Modal.Body>
          <img
            className="rs-icon"
            src="/rebornos-fire.svg"
            height={128}
            width={128}
            alt=""
          />
          <hr />
          <h6>RebornOS Fire</h6>
          <br />
          <p>
            v{process.env.VERSION} ({process.env.CODE_NAME})
            <br />
            System management utility for RebornOS
            <br />
          </p>
          <p
            style={{
              fontSize: 'small',
            }}
          >
            Copyright © 2021 SoulHarsh007
          </p>
          <p
            style={{
              fontSize: 'small',
            }}
          >
            This program comes with absolutely no warranty.
            <br />
            see the
            <Button
              appearance="link"
              size="xs"
              onClick={() =>
                shell.openExternal('https://www.gnu.org/licenses/gpl-3.0.html')
              }
            >
              GNU General Public Licence, version 3 or later
            </Button>
            for details
          </p>
        </Modal.Body>
      </Modal>
    </FlexboxGrid>
  );
}
