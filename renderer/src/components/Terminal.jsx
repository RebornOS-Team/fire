import {ipcRenderer, shell} from 'electron';
import 'xterm/css/xterm.css';
import React, {useEffect, useState} from 'react';
import {Terminal} from 'xterm';
import {WebLinksAddon} from 'xterm-addon-web-links';
import {Icon, IconButton, ButtonGroup, Progress, Divider, Alert} from 'rsuite';
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
  const [totalPer, setTotalPer] = useState(0);
  const [progress, setProgress] = useState('active');
  useEffect(() => {
    ipcRenderer.removeAllListeners('logsError');
    ipcRenderer.removeAllListeners('logsGenerated');
    ipcRenderer.removeAllListeners('privateBinRes');
    ipcRenderer.send('termExec', state.packageDeps, state.packageName);
    const terminal = new Terminal({
      cursorBlink: true,
      convertEol: true,
      cols: 110,
      rows: 28,
    });
    terminal.loadAddon(
      new WebLinksAddon((e, url) => {
        e.preventDefault();
        shell.openExternal(url);
      })
    );
    terminal.open(document.getElementById('terminal'));
    terminal.onResize(resize =>
      ipcRenderer.send('termResize', resize.cols, resize.rows)
    );
    ipcRenderer.on('logsGenerated', (_event, data) => {
      terminal.write(`Logs generated, File can be found at: ${data}\n`);
      Alert.success(`Logs generated, File can be found at: ${data}`);
    });
    ipcRenderer.on('logsError', (_event, data) => {
      terminal.write(`Failed to generate logs, Error: ${data}\n`);
      Alert.error(`Failed to generate logs`);
    });
    ipcRenderer.on('termData', (_event, data) => {
      terminal.write(data);
      if (data.match(/Total.*[0-9]{1,3}%/g)) {
        setTotalPer(
          parseInt(
            data
              .match(/Total.*[0-9]{1,3}%/g)[0]
              .match(/[0-9]{1,3}%/g)[0]
              .replace('%', ''),
            10
          )
        );
      }
    });
    ipcRenderer.once('termExit', (_event, data) => {
      terminal.write(
        `\nProcess exited with code: ${
          data.signal || data.exitCode
        }, Command execution took: ${data.time}\n`
      );
      if (data.signal || data.exitCode) {
        terminal.write('\n\x1B[91mTask Failed!\x1B[0m\n');
        setProgress('fail');
      } else {
        terminal.write('\n\x1B[92mTask Completed!\x1B[0m\n');
        setProgress('success');
        setTotalPer(100);
      }
      ipcRenderer.removeAllListeners('termData');
    });
    ipcRenderer.on('privateBinRes', (_event, data) => {
      if (data.message) {
        terminal.write(`Failed to create a paste, Error: ${data.message}`);
        return Alert.error(`Failed to create a paste`);
      }
      terminal.write(
        `Paste created:\bURL: ${data.url}\nDeletion Token: ${data.deleteToken}`
      );
      Alert.success(`Paste created!`);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <ButtonGroup justified>
        <IconButton
          icon={<Icon icon="file-text" />}
          appearance="ghost"
          onClick={() => ipcRenderer.send('generateLogs')}
        >
          Generate Log File
        </IconButton>
        <IconButton
          icon={<Icon icon="link" />}
          appearance="ghost"
          disabled={state.activeTasks}
          onClick={() => ipcRenderer.send('privateBin')}
        >
          PrivateBinIt!
        </IconButton>
        <IconButton
          icon={<Icon icon="back-arrow" />}
          appearance="ghost"
          disabled={state.activeTasks}
          onClick={() =>
            dispatch({
              type: 'ContentUpdate',
              newContent: state.origin,
              terminal: false,
            })
          }
        >
          Return
        </IconButton>
      </ButtonGroup>
      <Divider />
      <Progress.Line percent={totalPer} status={progress} />
    </>
  );
}
