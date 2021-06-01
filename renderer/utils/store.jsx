import {createContext, useReducer} from 'react';
import {RenderDashboard} from '../components/RenderDashboard';

const initialState = {
  showAboutModal: false,
  scanPackages: true,
  content: <RenderDashboard />,
  install: {
    status: false,
    packageName: '',
    packageDeps: ['pacman', '-Sv', '--noconfirm', '--needed'],
  },
  uninstall: {
    status: false,
    packageName: '',
    packageDeps: ['pacman', '-Rv', '--noconfirm'],
  },
  enable: {
    status: false,
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
        install: {
          status: action.status,
          packageName: action.name,
          packageDeps: [
            ...['pacman', '-Sv', '--noconfirm', '--needed'],
            ...action.deps,
          ],
        },
        content: action.goto,
      };
    case 'UnInstallationUpdate':
      return {
        ...state,
        uninstall: {
          status: action.status,
          packageName: action.name,
          packageDeps: [...['pacman', '-Rv', '--noconfirm'], ...action.deps],
        },
        content: action.goto,
      };
    case 'EnableUpdate':
      return {
        ...state,
        enable: {
          status: action.enable,
          packageName: action.name,
          packageDeps: [...['systemctl', 'enable'], ...action.deps],
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
    <Context.Provider value={[state, dispatch]}>{children}</Context.Provider>
  );
};
