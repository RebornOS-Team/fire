import {createContext, useReducer} from 'react';
import {RenderDashboard} from '../components/RenderDashboard';

const initialState = {
  installationActive: false,
  showAboutModal: false,
  scanPackages: true,
  content: <RenderDashboard />,
  install: {
    packageName: '',
    packageDeps: ['pacman', '-Sv', '--noconfirm', '--needed'],
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
        installationActive: !state.installationActive,
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
