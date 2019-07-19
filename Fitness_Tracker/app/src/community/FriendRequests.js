import React, { Component } from 'react';
const friendReqURL = "http://localhost:8080/getFriendReqs"

class FriendRequests extends Component {
  _isMounted = false
  constructor(props) {
    super(props)
    this.renderFriends = this.renderFriends.bind(this)
  }

  componentWillUnmount() {
    this._isMounted = false
    console.log('friendRequests has unmounted')
  }

  componentDidMount() {
    this._isMounted = true
    console.log("frienRequests has mounted")
  }

  renderFriends() {
    // onClick function definition
    var { friendRequests, addFriendToState, removeFriendReq, acceptRequest } = this.props
    var liTags = []
    friendRequests.forEach((sender, idx) => {
      var { senderID, senderFirstName, senderLastName } = sender
      liTags.push(
        <div key={senderID} className="user-container">
          <li>{senderFirstName}, {senderLastName}</li>
          <button
            onClick={() => {
              acceptRequest(senderID, senderFirstName, senderLastName)
              removeFriendReq(senderID)
              addFriendToState(senderID, senderFirstName, senderLastName)
            }}
          >
            accept
          </button>
        </div>
      )
    })
    return liTags
  }

  render() {
    return (
      <div className="friend-requests">
        <h4>requests... {this.props.numRequests}</h4>
        <ul className="friend-requests-list">
          {this.renderFriends()}
        </ul>
      </div>
    )
  }
}

export default FriendRequests
