import React, {createContext, useReducer, Fragment, useContext} from 'react';
import {RenderDashboard} from '../components/RenderDashboard';

const initialState = {
  showAboutModal: false,
  activeTasks: false,
  content: <RenderDashboard />,
  origin: <Fragment />,
  packageName: '',
  install: {
    packageDeps: ['pacman', '-Sv', '--noconfirm', '--needed'],
  },
  uninstall: {
    packageDeps: ['pacman', '-Rv', '--noconfirm'],
  },
  enable: {
    packageDeps: ['systemctl', 'enable'],
  },
  terminal: true,
};
export const reducer = (state, action) => {
  switch (action.type) {
    case 'AboutModal':
      return {
        ...state,
        showAboutModal: !state.showAboutModal,
      };
    case 'ScanPackages':
      return {
        ...state,
        scanPackages: !state.scanPackages,
      };
    case 'ContentUpdate':
      return {
        ...state,
        content: action.newContent,
        terminal: action.terminal,
      };
    case 'InstallationUpdate':
      return {
        ...state,
        activeTasks: action.status,
        packageName: action.name,
        origin: action.origin,
        install: {
          packageDeps: [
            ...['pacman', '-Sv', '--noconfirm', '--needed'],
            ...action.deps,
          ],
        },
        content: action.goto,
        terminal: action.terminal,
      };
    case 'UnInstallationUpdate':
      return {
        ...state,
        activeTasks: action.status,
        packageName: action.name,
        origin: action.origin,
        uninstall: {
          packageDeps: [...['pacman', '-Rv', '--noconfirm'], ...action.deps],
        },
        content: action.goto,
        terminal: action.terminal,
      };
    case 'EnableUpdate':
      return {
        ...state,
        activeTasks: action.status,
        packageName: action.name,
        origin: action.origin,
        enable: {
          packageDeps: action.deps,
        },
        content: action.goto,
        terminal: action.terminal,
      };
    default:
      return state;
  }
};
export const Context = createContext({
  state: initialState,
  dispatch: () => null,
});
// eslint-disable-next-line react/prop-types
export const GlobalStore = ({children}) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <Context.Provider value={{state, dispatch}}>{children}</Context.Provider>
  );
};

export const useGlobalStore = () => useContext(Context);
