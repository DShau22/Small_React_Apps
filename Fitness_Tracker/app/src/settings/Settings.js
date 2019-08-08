import React, { Component } from 'react'
import RedirectBox from "../generic/RedirectBox"
import {
  withRouter
} from "react-router-dom";

class Settings extends Component {
  _isMounted = false
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    console.log("settings mounting...")
    this._isMounted = true
  }

  componentWillUnmount() {
    console.log("settings unmounting...")
    this._isMounted = false
  }
  
  render() {
    var { context, match } = this.props
    console.log(context)
    return (
      <div>
        <h3>Settings</h3>
        <img src={`${context.profilePicture.profileURL}`} width="200" height="200"></img>
        <h4>Welcome, {context.firstName}</h4>
        <p>control what you want displayed, your unit system, and password settings</p>
        <div className="grid-menu" id="settings-menu" style={protoStyle}>
          <RedirectBox redirectURL={`${match.url}/personal`} linkText={"Personal Info"}></RedirectBox>
          <RedirectBox redirectURL={`${match.url}/security`} linkText={"Security/Passwords"}></RedirectBox>
          <RedirectBox redirectURL={`${match.url}/stats`} linkText={"Fitness Stats"}></RedirectBox>
          <RedirectBox redirectURL={`${match.url}/advanced`} linkText={"Advanced Settings"}></RedirectBox>
        </div>
      </div>
    )
  }
}

const protoStyle = {
  "display": "flex",
  "flexDirection": "row",
  "flexWrap": "wrap"
}

export default withRouter(Settings)

