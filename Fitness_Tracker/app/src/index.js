import 'bootstrap/dist/css/bootstrap.css';

import React, { Component } from 'react'
import ReactDOM from 'react-dom'
// bootstrap imports
import $ from 'jquery';
import Popper from 'popper.js';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import './index.css'
// bootstrap imports

//core ui
import "@coreui/coreui"
//core ui
import App from './App.js'

ReactDOM.render(<App />, document.getElementById('root'))
