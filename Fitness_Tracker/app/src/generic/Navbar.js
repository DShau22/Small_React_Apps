import React, { Component } from 'react'
import {
  NavLink,
  withRouter
} from "react-router-dom";
import "./sidebar.css"

class Navbar extends Component {
  constructor(props) {
    super(props)
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
    var { homeURL, communityURL, fitnessURL, profileURL } = this.props
    return (
      <div>
      <div id="mySidenav" className="sidenav">
        <a href="#" className="closebtn" onClick={this.closeNav}>&times;</a>
        <NavLink className="nav-link" exact to={homeURL}>Home page</NavLink>
        <NavLink className="nav-link" to={{pathname: communityURL}}>Community</NavLink>
        <NavLink className="nav-link" to={{pathname: fitnessURL}}>Fitness</NavLink>
        <NavLink className="nav-link" to={{pathname: profileURL}}>Profile</NavLink>
      </div>
      <span onClick={this.openNav}>&#9776;open</span>
    </div>
    )

      // <div>
      //   <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      //     <a className="navbar-brand" href="#">CompanyName</a>
      //     <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent">
      //       <span className="navbar-toggler-icon"></span>
      //     </button>
      //     <div className="collapse navbar-collapse" id="navbarSupportedContent">
      //       <ul className="navbar-nav ml-auto">
      //         <li className="nav-item">
      //           {/* <a className="nav-link" href="#">Home</a> */}
      //           <NavLink className="nav-link" exact to={homeURL}>Home page</NavLink>
      //         </li>
      //         <li className="nav-item">
      //           {/* <a className="nav-link" href="#">Home</a> */}
      //           <NavLink className="nav-link" to={{pathname: communityURL}}>Community</NavLink>
      //         </li>
      //         <li className="nav-item">
      //           <NavLink className="nav-link" to={{pathname: fitnessURL}}>Fitness</NavLink>
      //         </li>
      //         <li className="nav-item">
      //           <NavLink className="nav-link" to={{pathname: profileURL}}>Profile</NavLink>
      //         </li>
      //       </ul>
      //     </div>
      //   </nav>
      // </div>
  }
}

export default withRouter(Navbar)