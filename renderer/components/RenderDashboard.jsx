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
import {useState, useEffect, useRef} from 'react';
import {spawn} from 'child_process';
import {StopWatch} from '../utils/stopWatch';

/**
 * @function RenderDashboard
 * @author SoulHarsh007 <harshtheking@hotmail.com>
 * @copyright SoulHarsh007 2021
 * @since v1.0.0-Beta
 * @description Used for rendering Dashboard
 * @returns {import('react').JSXElementConstructor} - React Body
 */
export function RenderDashboard() {
  const [forceInstall] = useState(false);
  const [command, setCommand] = useState([]);
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
    setCommand(['ping', '-c2', '127.0.0.1']);
  }, []);
  useEffect(() => {
    if (!command.length) return;
    const commandWatch = new StopWatch();
    commandWatch.start();
    const childProcess = spawn('pkexec', command);
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
  }, [forceInstall, command]);
  const [scroll, setScroll] = useState(true);
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
