import {
  Icon,
  Panel,
  Grid,
  Col,
  Row,
  Divider,
  IconButton,
  ButtonGroup,
  Checkbox,
} from 'rsuite';
import {useState, useEffect, useRef, useContext} from 'react';
import {spawn} from 'child_process';
import {StopWatch} from '../utils/stopWatch';
import {Context} from '../utils/store';

/**
 * @function RenderInstallation
 * @author SoulHarsh007 <harshtheking@hotmail.com>
 * @copyright SoulHarsh007 2021
 * @since v1.0.0-Beta
 * @description Used for rendering Active Installation
 * @returns {import('react').JSXElementConstructor} - React Body
 */
export function RenderInstallation() {
  const [state] = useContext(Context);
  const [commandOutput, setCommandOutput] = useState('');
  const AlwaysScrollToBottom = () => {
    const elementRef = useRef();
    useEffect(
      () =>
        elementRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'end',
        }),
      []
    );
    return <div ref={elementRef} />;
  };
  useEffect(() => {
    if (!state.installationActive) return;
    const commandWatch = new StopWatch();
    commandWatch.start();
    const childProcess = spawn('pkexec', state.install.packageDeps);
    setTimeout(() =>
      setCommandOutput(
        x =>
          `${x}Child process spawned: PID: ${
            childProcess.pid
          } Command: ${childProcess.spawnargs.join(' ')}\n`
      )
    );
    childProcess.stdout.on('data', data => {
      console.log(data.toString());
      setTimeout(() => setCommandOutput(x => `${x}${data.toString()}`), 450);
    });
    childProcess.stderr.on('data', data => {
      console.log(data.toString());
      setTimeout(() => setCommandOutput(x => `${x}${data.toString()}`), 450);
    });
    childProcess.once('close', (code, signal) => {
      commandWatch.stop();
      const out = signal ? `(${signal})` : '';
      setTimeout(
        () =>
          setCommandOutput(
            x =>
              `${x}Child process exited with code: ${code} ${out}\nCommand execution took: ${commandWatch.toString()}`
          ),
        450
      );
    });
  }, [state.install.packageDeps, state.installationActive]);
  const [scroll, setScroll] = useState(true);
  return (
    <Grid
      fluid
      style={{
        textAlign: 'center',
      }}
    >
      <Row>
        <Panel
          header={<h3>You are installing: {state.install.packageName}</h3>}
          bodyFill
        ></Panel>
      </Row>
      <Divider />
      <Row>
        <Col>
          <div
            style={{
              maxHeight: 100,
              background: '#000',
              overflow: 'scroll',
              whiteSpace: 'pre-wrap',
              textAlign: 'left',
              fontFamily: 'monospace',
            }}
          >
            {commandOutput}
            {scroll ? <AlwaysScrollToBottom /> : undefined}
          </div>
          <Checkbox
            checked={scroll}
            onChange={() => setScroll(x => !x)}
            style={{
              textAlign: 'left',
            }}
          >
            Scroll with output
          </Checkbox>
          <ButtonGroup justified>
            <IconButton icon={<Icon icon="file-text" />} appearance="ghost">
              Generate Log File
            </IconButton>
            <IconButton icon={<Icon icon="stop" />} appearance="ghost">
              Abort
            </IconButton>
            <IconButton icon={<Icon icon="link" />} appearance="ghost">
              PasteBinIt!
            </IconButton>
          </ButtonGroup>
        </Col>
        <hr />
      </Row>
    </Grid>
  );
}