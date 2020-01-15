import React, { Component } from 'react';
// const friendReqURL = "http://localhost:8080/getFriendReqs"

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
      var { id, firstName, lastName } = sender
      liTags.push(
        <div key={id} className="user-container">
          <li>{firstName} {lastName}</li>
          <button
            onClick={() => {
              acceptRequest(id, firstName, lastName);
              removeFriendReq(id);
              addFriendToState(id, firstName, lastName);
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
      <div className="friend-requests" style={protoStyle}>
        <h4>requests... {this.props.numRequests}</h4>
        <ul className="friend-requests-list">
          {this.renderFriends()}
        </ul>
      </div>
    )
  }
}

const protoStyle = {
  "marginTop": "100px"
}

export default FriendRequests
