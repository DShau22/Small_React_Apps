import React, { Component } from 'react'
import './App.css'
import Spa from "./Spa"
import Login from "./login/login"

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      user: null,
    }
  }

  render() {
    return (
      <div className="outerContainer">
        {this.state.user ? (<Spa />) : (<Login />)}
      </div>
    )
  }
}

export default App
