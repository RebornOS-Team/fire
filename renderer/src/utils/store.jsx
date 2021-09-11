import {ipcRenderer} from 'electron';
import React, {createContext, useReducer, Fragment, useContext} from 'react';
import {RenderDashboard} from '../components/RenderDashboard';

const initialState = {
  showAboutModal: false,
  activeTasks: false,
  content: <RenderDashboard />,
  origin: <Fragment />,
  packageName: '',
  packageDeps: [],
  terminal: true,
  activeTaskType: 'install',
};

export const reducer = (state, action) => {
  ipcRenderer.send(
    'debug',
    `State: ${JSON.stringify(state)}, Action: ${JSON.stringify(action)}`
  );
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
        packageDeps: [
          ...['pacman', '-Sv', '--noconfirm', '--needed'],
          ...action.deps,
        ],
        content: action.goto,
        terminal: action.terminal,
        activeTaskType: 'installing',
      };
    case 'VersionInstallationUpdate':
      return {
        ...state,
        activeTasks: action.status,
        packageName: action.name,
        origin: action.origin,
        packageDeps: [
          ...['pacman', '-Uv', '--noconfirm', '--needed'],
          ...action.deps,
        ],
        content: action.goto,
        terminal: action.terminal,
        activeTaskType: 'installing',
      };
    case 'UnInstallationUpdate':
      return {
        ...state,
        activeTasks: action.status,
        packageName: action.name,
        origin: action.origin,
        packageDeps: [...['pacman', '-Rv', '--noconfirm'], ...action.deps],
        content: action.goto,
        terminal: action.terminal,
        activeTaskType: 'un-installing',
      };
    case 'EnableUpdate':
      return {
        ...state,
        activeTasks: action.status,
        packageName: action.name,
        origin: action.origin,
        packageDeps: action.deps,
        content: action.goto,
        terminal: action.terminal,
        activeTaskType: 'enabling',
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
