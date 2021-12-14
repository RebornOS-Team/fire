const env = require('./env');
// eslint-disable-next-line security/detect-child-process
const {spawn} = require('child_process');
spawn('yarn', ['run', 'build:all'], {
  env,
  stdio: 'inherit',
  cwd: process.cwd(),
});
