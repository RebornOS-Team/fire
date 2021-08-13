import React from 'react';
import ReactDOM from 'react-dom';
import {GlobalStore} from './utils/store';
import App from './App';

ReactDOM.render(
  <React.StrictMode>
    <GlobalStore>
      <App />
    </GlobalStore>
  </React.StrictMode>,
  document.getElementById('root')
);
