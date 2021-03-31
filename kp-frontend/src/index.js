import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './css/dest/app.global.css';
import registerServiceWorker from './registerServiceWorker';
import { LocalizeProvider } from "react-localize-redux";
ReactDOM.render(<LocalizeProvider><App /></LocalizeProvider>, document.getElementById('root'));
registerServiceWorker();
