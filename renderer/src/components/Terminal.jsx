import {ipcRenderer, clipboard} from 'electron';
import 'xterm/css/xterm.css';
import React, {useEffect, useState} from 'react';
import {Terminal} from 'xterm';
import {WebLinksAddon} from 'xterm-addon-web-links';
import {LinkProvider} from 'xterm-link-provider';
import IconButton from 'rsuite/IconButton';
import ButtonGroup from 'rsuite/ButtonGroup';
import Progress from 'rsuite/Progress';
import Divider from 'rsuite/Divider';
import toaster from 'rsuite/toaster';
import Message from 'rsuite/Message';
import Modal from 'rsuite/Modal';
import Button from 'rsuite/Button';
import LegacyFileTextIcon from '@rsuite/icons/legacy/FileText';
import LegacyLinkIcon from '@rsuite/icons/legacy/Link';
import LegacyBackArrowIcon from '@rsuite/icons/legacy/BackArrow';
import {useGlobalStore} from '../utils/store';
import {execFile} from 'child_process';

/**
 * @function TerminalComponent
 * @author SoulHarsh007 <harsh.peshwani@outlook.com>
 * @copyright SoulHarsh007 2021
 * @since v1.0.0-Pre-Alpha
 * @returns {import('react').ReactFragment} managed terminal component
 */
export default function TerminalComponent() {
  const {state, dispatch} = useGlobalStore();
  const [totalPer, setTotalPer] = useState(0);
  const [progress, setProgress] = useState('active');
  const [pacmanModal, setPacmanModal] = useState(false);
  const [pacmanMsg, setPacmanMsg] = useState('');
  const [pacmanChoices, setPacmanChoices] = useState([]);
  useEffect(() => {
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
        execFile('xdg-open', [url]).unref();
      })
    );
    terminal.registerLinkProvider(
      new LinkProvider(
        terminal,
        // eslint-disable-next-line security/detect-unsafe-regex
        /(?:^|[^\da-z.-]+)(((\/[ /\w.\-%~:+@]*)*([^:"'\s])))($|[^/\w.\-%]+)/,
        (e, url) => {
          e.preventDefault();
          execFile('xdg-open', [url]).unref();
        }
      )
    );
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    terminal.open(document.getElementById('terminal'));
    terminal.onResize(resize =>
      ipcRenderer.send('termResize', resize.cols, resize.rows)
    );
    const logsHandler = (_, data) => {
      terminal.write(`Logs generated, File can be found at: ${data}\n`);
      toaster.push(
        <Message
          type="success"
          showIcon
          closable
        >{`Logs generated, File can be found at: ${data}`}</Message>
      );
    };
    const logsError = (_, data) => {
      terminal.write(`Failed to generate logs, Error: ${data}\n`);
      toaster.push(
        <Message
          type="error"
          showIcon
          closable
        >{`Failed to generate logs`}</Message>
      );
    };
    const termData = (_, data) => {
      terminal.write(data);
      const pacmanQuestion = data.match(/^.*\? \[\w\/\w\] .+$/gm);
      if (pacmanQuestion) {
        const defaultChoice = pacmanQuestion[0].match(/\[[A-Z]\/[a-z]\]/g);
        if (defaultChoice) {
          ipcRenderer.send('termInput', defaultChoice[0].match(/\w/g)[0]);
        } else {
          setPacmanChoices(
            pacmanQuestion[0]
              .match(/\[[a-z]\/[A-Z]\]/g)[0]
              .match(/\w/g)
              .map(x => x.toUpperCase())
          );
          setPacmanMsg(
            pacmanQuestion[0]
              .split(' ')
              .slice(1, -1)
              .join(' ')
              .replace(/ \[\w\/\w\]/g, '')
          );
          setPacmanModal(true);
        }
      }
      const pacmanChoice = data.match(/^.+\(\w+=\d{1,2}\): .+$/gm);
      if (pacmanChoice) {
        ipcRenderer.send('termInput', pacmanChoice[0].match(/\d{1,2}/g)[0]);
      }
      if (data.match(/Total.*\d{1,3}%/g)) {
        setTotalPer(
          parseInt(
            data
              .match(/Total.*\d{1,3}%/g)[0]
              .match(/\d{1,3}%/g)[0]
              .replace('%', ''),
            10
          )
        );
      }
    };
    const privateBinResponse = (_, data) => {
      if (data.message) {
        terminal.write(
          `\nFailed to create a paste, Both servers return an error:\nPrimary Server Error: ${data.errors.primary}\nFallback Server Error: ${data.errors.fallback}\n`
        );
        return toaster.push(
          <Message
            type="error"
            showIcon
            closable
          >{`Failed to create a paste`}</Message>
        );
      }
      if (data.errors.primary) {
        terminal.write(
          `\nPrimary server returned an error: ${data.errors.primary}\n`
        );
      }
      terminal.write(
        `\nPaste created:\bURL: ${data.url}\nDeletion Token: ${data.deleteToken}\n`
      );
      clipboard.writeText(data.url);
      return toaster.push(
        <Message
          type="success"
          showIcon
          closable
        >{`Paste created successfully and link copied to clipboard!`}</Message>
      );
    };
    ipcRenderer.on('logsGenerated', logsHandler);
    ipcRenderer.on('logsError', logsError);
    ipcRenderer.on('termData', termData);
    ipcRenderer.once('termExit', (_, data) => {
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
    });
    ipcRenderer.on('privateBinRes', privateBinResponse);
    return () => {
      ipcRenderer.removeListener('logsGenerated', logsHandler);
      ipcRenderer.removeListener('logsError', logsError);
      ipcRenderer.removeListener('termData', termData);
      ipcRenderer.removeListener('privateBinRes', privateBinResponse);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <ButtonGroup justified>
        <IconButton
          icon={<LegacyFileTextIcon />}
          appearance="ghost"
          onClick={() => ipcRenderer.send('generateLogs')}
        >
          Generate Log File
        </IconButton>
        <IconButton
          icon={<LegacyLinkIcon />}
          appearance="ghost"
          disabled={state.activeTasks}
          onClick={() => ipcRenderer.send('privateBin')}
        >
          PrivateBinIt!
        </IconButton>
        <IconButton
          icon={<LegacyBackArrowIcon />}
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
      <Modal
        size="xs"
        open={pacmanModal}
        onClose={() => setPacmanModal(false)}
        backdrop="static"
        keyboard={false}
        style={{
          textAlign: 'center',
        }}
      >
        <Modal.Header closeButton={false}>Pacman choice:</Modal.Header>
        <Modal.Body>{pacmanMsg}</Modal.Body>
        <Modal.Footer>
          <ButtonGroup justified>
            <Button
              onClick={() => {
                setPacmanModal(false);
                ipcRenderer.send('termInput', pacmanChoices[0]);
              }}
              appearance="primary"
            >
              {pacmanChoices[0]}
            </Button>
            <Button
              onClick={() => {
                setPacmanModal(false);
                ipcRenderer.send('termInput', pacmanChoices[1]);
              }}
              appearance="subtle"
            >
              {pacmanChoices[1]}
            </Button>
          </ButtonGroup>
        </Modal.Footer>
      </Modal>
    </>
  );
}
