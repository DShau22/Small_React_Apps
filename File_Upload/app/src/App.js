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

class App extends Component {

  render() {
    return (
      <HashRouter>
        <div className="App">
          <ul className="Header">
            <li><NavLink exact to="/">Home</NavLink></li>
            <li><NavLink to="/stuff">Stuff</NavLink></li>
            <li><NavLink to="/uploadFiles">File Upload</NavLink></li>
          </ul>
          <div className="Card">
            <Route exact path="/" component={Home}/>
            <Route path="/stuff" component={Stuff}/>
            <Route path="/uploadFiles" component={Upload}/>
            <Route path="/graph" component={Graph}/>
          </div>
        </div>
      </HashRouter>
    )
  }
}

export default App
