// Displays the profile of the user who is logged in on the browser
// They should be able to see everything
import React, { Component } from 'react'
import {
  Redirect,
  withRouter
} from "react-router-dom";
import { englishHeight }from "../utils/unitConverter"
import SpaContext from '../Context';

// replace with default avatar link
const imgAlt = "./default_profile.png"

class UserProfile extends Component {
  constructor(props) {
    super(props)
    this.state = {
      bestJump: "",
      bestSwim: "",
      bestRun: "",
      editProfile: false,
    }
  }

  componentDidMount() {
    console.log("profile mounted")
    // make a fetch request to get the bests of each user,
    // as well as the units they wanna display
  }

  renderBio() {
    var { bio } = this.context
    if (bio) {
      return (
        <p>{bio}</p>
      )
    }
    return (
      <p>No bio yet</p>
    )
  }

  renderGender() {
    var { gender } = this.context
    // var { displayGender } = settings
    if (gender /* && displayGender */) {
      return (
        <p>{gender}</p>
      )
    }
    return (
      <p>hidden</p>
    )
  }

  renderHeight() {
    var { height, settings } = this.context
    var { unitSystem } = settings
    unitSystem = unitSystem.toLowerCase()
    // var { displayHeight } = settings
    if (height /* && displayHeight */) {
      var englishDisplay = englishHeight(height)
      return (
        unitSystem === "english" ? 
          (<p>{englishDisplay.feet} ft {englishDisplay.inches} in</p>) :
          (<p>{height} cm</p>)
      )
    }
    return (
      <p>hidden</p>
    )
  }

  renderWeight() {
    var { weight, settings } = this.context
    var { unitSystem } = settings
    unitSystem = unitSystem.toLowerCase()
    var units = (unitSystem === "english") ? "lbs" : "kg"
    // var { displayWeight } = settings
    if (weight /* && displayWeight */) {
      return (
        <p>{weight} {units}</p>
      )
    }
    return (
      <p>hidden</p>
    )
  }

  renderBests() {
    // calculate bests based off of state and settings
  }

  renderNumFriends() {
    var { friends } = this.context
    return (
      <p>{"friends: " + friends.length}</p>
    )
  }

  render() {
    // if user clicked the button to go to the edit profile page
    if (this.state.editProfile) {
      // debugger;
      return ( <Redirect to={{pathname: `${this.props.match.url}/edit`,}}/> )
    }
    if (this.context.mounted) {
      return (
        <div className="profile-container" style={protoStyle}>
          <div className="edit-container" style={protoStyle}>
            <h2>edit profile button</h2>
            <button
              onClick={() => {
                this.setState({ editProfile: true })
              }}
            >
              edit
            </button>
          </div>
          <div className="profile-picture-container" style={protoStyle}>
            <p>image goes here...</p>
            <img src={this.context.profilePicture.profileURL} height="50" width="50" alt={imgAlt}/>
          </div>
          <div className="weight-container" style={protoStyle}>
            {this.renderWeight()}
          </div>
          <div className="gender-container" style={protoStyle}>
            {this.renderGender()}
          </div>
          <div className="height-container" style={protoStyle}>
            {this.renderHeight()}
          </div>
          <div className="bio-container" style={protoStyle}>
            {this.renderNumFriends()}
          </div>
          <div className="num-friends-container" style={protoStyle}>
            {this.renderBio()}
          </div>
        </div>
      )
    } else {
      // spa hasn't mounted and established context yet
      return (
        <div className="profile-loading-container">
          <span>loading...</span>
        </div>
      )
    }
  }
}
UserProfile.contextType = SpaContext
const protoStyle = {
  "border": "solid",
  "marginTop": "10px"
}

export default withRouter(UserProfile)
