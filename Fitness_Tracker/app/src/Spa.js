import React, { Component } from 'react'
import './App.css'
import {
  Route,
  withRouter,
  BrowserRouter,
} from "react-router-dom";

import Login from "./login/Login"
import Confirmation from "./login/Confirmation"
import PwResetPage from "./login/PwResetPage"

import Header from "./home/Header"

// for router transitions
import {
  TransitionGroup,
  CSSTransition
} from "react-transition-group"
import "./transitions.css"

// server url
const root = "/app"

class Spa extends Component {
  _isMounted = false
  constructor(props) {
    super(props)
  }

  render() {
    console.log("rendering spa...")
    var { match } = this.props
    return (
      <div className="App">
        <Route exact path="/" component={Login} />
        <Route path="/confirmation" component={Confirmation} />
        <Route path="/pwResetPage" component={PwResetPage} /> 
        {/* intentionally render the header component with all the others (no switch) */}
        <Route path={`${root}`} component={Header}/>
      </div>
    )
  }
}

export default withRouter(Spa)
