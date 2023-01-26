import React from 'react';
import ReactDOM from 'react-dom/client';
import './lang/i18n';
import './index.css';
import { App } from './App';
import reportWebVitals from './reportWebVitals';
import * as serviceWorker from './serviceWorker';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();
serviceWorker.listenForMessages();
