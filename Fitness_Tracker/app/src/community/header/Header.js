import React, { Component } from 'react'

export default class Header extends Component {
  render() {
    return (
      <div className="community-header">
        <nav className="navbar navbar-expand sticky navbar-dark bg-dark">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item">
              <span className="nav-link">Friends</span>
            </li>
            <li className="nav-item">
              <span className="nav-link">Requests</span>
            </li>
          </ul>
        </nav>
      </div>
    )
  }
}
