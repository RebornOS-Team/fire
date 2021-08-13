import {ipcRenderer} from 'electron';
import 'xterm/css/xterm.css';
import React, {useEffect} from 'react';
import {Terminal} from 'xterm';
import {Icon, IconButton, ButtonGroup} from 'rsuite';
import {useGlobalStore} from '../utils/store';

/**
 * @function RenderUtilities
 * @author SoulHarsh007 <harshtheking@hotmail.com>
 * @copyright SoulHarsh007 2021
 * @since v1.0.0-Pre-Alpha
 * @param {{command: string[]}} _props - Component props
 * @returns {import('react').DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>} div for our terminal!
 */
export default function TerminalComponent(_props) {
  const {state, dispatch} = useGlobalStore();
  useEffect(() => {
    const terminal = new Terminal({
      cursorBlink: true,
      convertEol: true,
      rows: 30,
    });
    terminal.open(document.getElementById('terminal'));
    terminal.onResize(resize =>
      ipcRenderer.send('termResize', resize.cols, resize.rows)
    );
    ipcRenderer.on('termData', (_event, data) => terminal.write(data));
    ipcRenderer.once('termExit', (_event, data) => {
      terminal.write(
        `\nProcess exited with code: ${
          data.signal || data.exitCode
        }, Command execution took: ${data.time}\n`
      );
      terminal.write(
        data.signal || data.exitCode
          ? '\n\x1B[91mTask Failed!\x1B[0m\n'
          : '\n\x1B[92mTask Completed!\x1B[0m\n'
      );
      ipcRenderer.removeAllListeners('termData');
    });
  }, []);
  return (
    <ButtonGroup justified>
      <IconButton
        icon={<Icon icon="file-text" />}
        appearance="ghost"
        style={{
          display: 'none',
        }}
      >
        Generate Log File
      </IconButton>
      <IconButton
        icon={<Icon icon="stop" />}
        appearance="ghost"
        onClick={() => ipcRenderer.send('termKill')}
        disabled={!state.activeTasks}
      >
        Cancel
      </IconButton>
      <IconButton
        icon={<Icon icon="link" />}
        appearance="ghost"
        style={{
          display: 'none',
        }}
      >
        PasteBinIt!
      </IconButton>
      <IconButton
        icon={<Icon icon="back-arrow" />}
        appearance="ghost"
        disabled={state.activeTasks}
        onClick={() => {
          dispatch({
            type: 'ContentUpdate',
            newContent: state.origin,
            terminal: false,
          });
        }}
      >
        Return
      </IconButton>
    </ButtonGroup>
  );
}
