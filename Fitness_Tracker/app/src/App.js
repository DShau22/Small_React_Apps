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
      <div>
        <BrowserRouter>
          <Spa />
        </BrowserRouter>
        {/* <BrowserRouter>
          <Route path="/login" component={Login} />
          <Route path="/confirmation" component={Confirmation} />
          <Route path="/pwResetPage" component={PwResetPage} />
          <Route path="/app" component={Spa} />
        </BrowserRouter> */}
      </div>
    )
  }
}

export default App
