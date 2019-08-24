import React, { Component } from 'react'
import './App.css'
import {
  Route,
  withRouter
} from "react-router-dom";

import Login from "./login/Login"
import Confirmation from "./login/Confirmation"
import PwResetPage from "./login/PwResetPage"

import Header from "./home/Header"

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
      <div className="container-fluid">
        <div className="App">
          <div className="card text-center">
            <div className="card-body">
              <Route exact path="/" component={Login} />
              <Route path="/confirmation" component={Confirmation} />
              <Route path="/pwResetPage" component={PwResetPage} />
              {/* intentionally render the header component with all the others (no switch) */}
              <Route path={`${root}`} component={Header}/>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default withRouter(Spa)
