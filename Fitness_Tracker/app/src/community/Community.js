import React, { Component } from 'react'
import ComFooter from "./ComFooter"
import {
  NavLink,
} from "react-router-dom";
class Community extends Component {
  constructor(props) {
    super(props)
    this.state = {
      friends: ["Sean", "Derek", "Chris", "Jonathon"],
    }
    this.renderFriends = this.renderFriends.bind(this)
  }
  componentDidMount() {
    // make request to server to get list of friends and set state
  }
  renderFriends() {
    var liTags = []
    this.state.friends.forEach((friend, i) => {
      liTags.push(<li key={i}>{friend}</li>)
    })
    return liTags
  }
  render() {
    return (
      <div>
        <div>
          <h1>Friends :)</h1>
          <ul className="friendsList">
            {this.renderFriends()}
          </ul>
        </div>
        <ComFooter />
      </div>
    )
  }
}

export default Community
