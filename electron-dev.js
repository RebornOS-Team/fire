// eslint-disable-next-line security/detect-child-process
const {spawn} = require('child_process');
const webpack = require('webpack');

let firstCompile = true;
let mainProcess;
let rendererProcess;
const startRendererProcess = () => {
  rendererProcess = spawn('yarn', ['dev'], {
    cwd: `${process.cwd()}/renderer`,
    detached: true,
    env: {
      ...process.env,
      SKIP_PREFLIGHT_CHECK: true,
      BROWSER: 'none',
    },
  });
  rendererProcess.stdout.on('data', data =>
    console.log(`[Renderer] [STDOUT]: ${data}`)
  );
  rendererProcess.stderr.on('data', data =>
    console.log(`[Renderer] [STDERR]: ${data}`)
  );
  rendererProcess.on('error', data =>
    console.log(`[Renderer] [ERROR]: ${data}`)
  );
  rendererProcess.on('spawn', () =>
    console.log(`[Renderer] [SPAWN]: Renderer process spawned`)
  );
  rendererProcess.on('close', () => process.exit());
};
const startMainProcess = () => {
  mainProcess = spawn(
    'electron',
    ['.', '--remote-debugging-port=5858', '--inspect=9292', '--debug'],
    {
      detached: true,
      env: {
        ...process.env,
        PORT: 3000,
      },
    }
  );
  mainProcess.stdout.on('data', data =>
    console.log(`[Main] [STDOUT]: ${data}`)
  );
  mainProcess.stderr.on('data', data =>
    console.log(`[Main] [STDERR]: ${data}`)
  );
  mainProcess.on('error', data => console.log(`[Main] [ERROR]: ${data}`));
  mainProcess.on('spawn', () =>
    console.log(`[Main] [SPAWN]: Main process spawned`)
  );
};
startRendererProcess();
// eslint-disable-next-line security/detect-non-literal-fs-filename
const watching = webpack({
  ...require('./webpack.config'),
  mode: 'development',
}).watch({}, async err => {
  if (err) {
    console.error(err);
    if (err.stack) {
      console.error(err.stack);
    }
  }
  if (firstCompile) {
    firstCompile = false;
  }
  if (!err) {
    if (!firstCompile && mainProcess) {
      mainProcess.kill();
    }
    startMainProcess();
  }
});
const killWholeProcess = () => {
  watching?.close(() => {});
  if (mainProcess?.pid) {
    process.kill(mainProcess?.pid, 'SIGINT');
  }
  if (rendererProcess?.pid) {
    process.kill(-rendererProcess?.pid, 'SIGINT');
  }
};
process.on('SIGINT', killWholeProcess);
process.on('SIGTERM', killWholeProcess);
process.on('exit', killWholeProcess);
