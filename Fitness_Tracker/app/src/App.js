import React, { Component } from 'react'
import './App.css'
import {
  Route,
  NavLink,
  HashRouter
} from "react-router-dom";
import Home from "./Home"
import Community from "./community/Community"
import Graph from "./graph/Graph"
import RunDetails from "./graph/charts/RunDetails"
import SwimDetails from "./graph/charts/SwimDetails"
import JumpDetails from "./graph/charts/JumpDetails"

class App extends Component {

  render() {
    return (
      <HashRouter>
        <div className="App">
          <ul className="header">
            <li><NavLink activeClassName = "navLink" exact to="/">Home page</NavLink></li>
            <li><NavLink activeClassName = "navLink" to="/community">Community</NavLink></li>
            <li><NavLink activeClassName = "navLink" to="/graph">Progress</NavLink></li>
          </ul>
          <div className="Card">
            <Route exact path="/" component={Home}/>
            <Route path="/community" component={Community}/>
            <Route path="/graph" component={Graph}/>
            <Route path="/jumpDetails" component={JumpDetails}/>
            <Route path="/swimDetails" component={SwimDetails}/>
            <Route path="/runDetails" component={RunDetails}/>
          </div>
        </div>
      </HashRouter>
    )
  }
}

export default App
