import React, { Component } from 'react'
import {
  NavLink,
  withRouter
} from "react-router-dom";
import "./sidebar.css"

class Navbar extends Component {
  constructor(props) {
    super(props)
    this.state = {
      sideNavStyle: {
        width: "0px",
        clicked: false,
      }
    }
  }

  /* Set the width of the side navigation to 250px */
  openNav() {
    document.getElementById("mySidenav").style.width = "250px";
  }

  /* Set the width of the side navigation to 0 */
  closeNav() {
    document.getElementById("mySidenav").style.width = "0";
  }

  render() {
    var { homeURL, communityURL, fitnessURL, profileURL, settingsURL, logout } = this.props
    return (
      <div>
        <span onClick={this.openNav}>&#9776;</span>
        <div id="mySidenav" className="sidenav">
          <a href="#" className="closebtn" onClick={this.closeNav}>&times;</a>
          <NavLink 
            className="nav-link" 
            exact to={homeURL} 
            onClick={this.closeNav}
          >
            Home
          </NavLink>
          <NavLink 
            className="nav-link"
            to={{pathname: communityURL}}
            onClick={this.closeNav}
          >
            Community
          </NavLink>
          <NavLink
            className="nav-link"
            to={{pathname: fitnessURL}}
            onClick={this.closeNav}
          >
            Fitness
          </NavLink>
          <NavLink
            className="nav-link"
            to={{pathname: profileURL}}
            onClick={this.closeNav}
          >
            Profile
          </NavLink>
          <NavLink
            className='nav-link'
            to={{pathname: settingsURL}}
            onClick={this.closeNav}
          >
            Settings
          </NavLink>
          <span
            className='nav-link'
            onClick={logout}
          >
            Logout
          </span>
        </div>
      </div>
    )
  }
}

export default withRouter(Navbar)