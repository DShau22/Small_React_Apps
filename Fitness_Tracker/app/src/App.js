import React, { Component } from 'react'
import './App.css'
import Upload from './upload/Upload'
import {
  Route,
  NavLink,
  HashRouter
} from "react-router-dom";
import Stuff from './Stuff'
import Home from './Home'
import Graph from "./graph/Graph"
import Chart from "./graph/Chart"
import JumpDetails from "./graph/charts/JumpDetails"
import RunDetails from "./graph/charts/RunDetails"
import SwimDetails from "./graph/charts/SwimDetails"
import Community from "./community/Community"

class App extends Component {

  render() {
    return (
      <HashRouter>
        <div className="App">
          <ul className="header">
            <li><NavLink activeClassName = "navLink" exact to="/">Home page</NavLink></li>
            <li><NavLink activeClassName = "navLink" to="/community">Community</NavLink></li>
            <li><NavLink activeClassName = "navLink" to="/uploadFiles">File Upload</NavLink></li>
            <li><NavLink activeClassName = "navLink" to="/graph">Progress</NavLink></li>
          </ul>
          <div className="Card">
            <Route exact path="/" component={Home}/>
            <Route path="/community" component={Community}/>
            <Route path="/uploadFiles" component={Upload}/>
            <Route path="/graph" component={Graph}/>
            <Route path="/jumpDetails" component={JumpDetails}/>
            <Route path="/runDetails" component={RunDetails}/>
            <Route path="/swimDetails" component={SwimDetails}/>
          </div>
        </div>
      </HashRouter>
    )
  }
}

export default App
