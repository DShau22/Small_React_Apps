import React, { Component } from 'react'
import './App.css'
import Login from "./login/Login"
import {
  Route,
  withRouter,
  BrowserRouter,
} from "react-router-dom";
import Confirmation from "./login/Confirmation"
import PwResetPage from "./login/PwResetPage"
import Spa from "./Spa"

// for router transitions
import {
  TransitionGroup,
  CSSTransition
} from "react-transition-group"
import "./transitions.css"

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      user: null,
    }
  }

  render() {
    return (
      <BrowserRouter>
        <Spa />
      </BrowserRouter>
    )
  }
}

export default App
