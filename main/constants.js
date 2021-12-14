module.exports.keys = {
  dashboard: '1',
  desktops: '2',
  'display managers': '3',
  utilities: '4',
  'kernel management': '5',
  'system tweaks': '6',
};

module.exports.options = [
  {
    name: 'help',
    aliases: ['h', '?'],
    description: 'shows this help list',
  },
  {
    name: 'page',
    aliases: ['p'],
    description: 'opens with specified [PAGE] loaded',
  },
  {
    name: 'version',
    aliases: ['v'],
    description: 'prints program version and exits',
  },
  {
    name: 'debug',
    aliases: ['d'],
    description: 'enables additional logging to console',
  },
  {
    name: 'config',
    aliases: ['c'],
    description: 'prints active configuration and exits',
  },
  {
    name: 'update',
    aliases: ['u'],
    description: 'updates the resource modules and exits',
  },
];
