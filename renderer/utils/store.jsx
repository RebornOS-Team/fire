import {createContext, useReducer, Fragment} from 'react';
import {RenderDashboard} from '../components/RenderDashboard';

const initialState = {
  showAboutModal: false,
  activeTasks: false,
  content: <RenderDashboard />,
  install: {
    origin: <Fragment />,
    packageName: '',
    packageDeps: ['pacman', '-Sv', '--noconfirm', '--needed'],
  },
  uninstall: {
    origin: <Fragment />,
    packageName: '',
    packageDeps: ['pacman', '-Rv', '--noconfirm'],
  },
  enable: {
    origin: <Fragment />,
    packageName: '',
    packageDeps: ['systemctl', 'enable'],
  },
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
      };
    case 'InstallationUpdate':
      return {
        ...state,
        activeTasks: action.status,
        install: {
          packageName: action.name,
          packageDeps: [
            ...['pacman', '-Sv', '--noconfirm', '--needed'],
            ...action.deps,
          ],
          origin: action.origin,
        },
        content: action.goto,
      };
    case 'UnInstallationUpdate':
      return {
        ...state,
        activeTasks: action.status,
        uninstall: {
          packageName: action.name,
          packageDeps: [...['pacman', '-Rv', '--noconfirm'], ...action.deps],
          origin: action.origin,
        },
        content: action.goto,
      };
    case 'EnableUpdate':
      return {
        ...state,
        activeTasks: action.status,
        enable: {
          packageName: action.name,
          packageDeps: action.deps,
          origin: action.origin,
        },
        content: action.goto,
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
