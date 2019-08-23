import React, { Component } from 'react'

export default class Header extends Component {
  render() {
    return (
      <div className="community-header">
        <nav className="navbar navbar-expand sticky-top navbar-dark bg-dark">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item">
              <a className="nav-link" href="#">Friends</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">Requests</a>
            </li>
          </ul>
        </nav>
      </div>
    )
  }
}
