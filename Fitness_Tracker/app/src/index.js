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

//font awesome
import { library } from '@fortawesome/fontawesome-svg-core'
// import { fab } from '@fortawesome/free-brands-svg-icons'
import { faCheckSquare, faCoffee, faAtom, faFireAlt, faClock } from '@fortawesome/free-solid-svg-icons'

import App from './App.js'

library.add(faCheckSquare, faCoffee, faAtom, faFireAlt, faClock)

ReactDOM.render(<App />, document.getElementById('root'))
