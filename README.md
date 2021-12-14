# RebornOS FIRE

:exclamation: Currently, RebornOS FIRE can only run on RebornOS or if you have [RebornOS repositories](https://osdn.net/projects/rebornos/wiki/How%20to%20add%20the%20RebornOS%20repository) included in your `pacman.conf`

## How to build

### Requirements

- Node.JS, you can use the one from Arch Linux repositories or use a node version manager like NVM to get Node.JS
- [NPM](https://www.npmjs.com/), [PNPM](https://pnpm.io/) or [Yarn](https://yarnpkg.com/), Yarn is preferred over NPM and PNPM because the project itself uses Yarn
  - NPM is available in Arch Linux repositories
  - Yarn is available in Arch Linux repositories, it can be also installed via NPM (`npm i -g yarn`) or PNPM (`pnpm i -g yarn`)
  - PNPM can be installed via NPM (`npm i -g pnpm`) or Yarn (`yarn global add pnpm`)

### Building

- Clone this repository: `git clone --depth=1 https://github.com/RebornOS-Team/fire`
- Change directory to the root of the project: `cd fire`
- Install dependencies for both, the renderer and the main process
  - Run `yarn install` or `npm install` or `pnpm install` in the root directory
  - Run `yarn install` or `npm install` or `pnpm install` in the renderer directory (`cd renderer`)
- Run `yarn build:dist` or `npm build:dist` or `pnpm build:dist` to start build process, this will also call `makepkg` for installation

:warning: This will use `/tmp/makepkg` for building and can use a lot of memory, I suggest you to edit `makepkg.conf` in the project's root directory (line 15, `BUILDDIR` option)

## Configuration

FIRE can be configured on per-user basis using the configuration file at: `$HOME/.config/rebornos-fire/fire.config.yaml`
This file is documented at: `/usr/share/doc/rebornos-fire/fire.config.yaml`
