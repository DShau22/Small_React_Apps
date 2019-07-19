import {
  getFromLocalStorage,
  getFromSessionStorage,
  storageKey,
} from '../utils/storage';

import React, { Component } from 'react'
import Searchbar from "./Searchbar"
import FriendRequests from "./FriendRequests"
import "./style/Community.css"
const searchURL = "http://localhost:8080/searchUser"
const friendReqURL = "http://localhost:8080/sendFriendReq"
const getUserInfoURL = "http://localhost:8080/getUserInfo"
const tokenToID = "http://localhost:8080/tokenToID"
const acceptFriendURL = "http://localhost:8080/acceptRequest"

class Community extends Component {
  // used to keep track of mounting lifecycle
  // sometimes components in the router get
  // mounted, the unmounted right away, still dont know why
  _isMounted = false

  constructor(props) {
    super(props)
    this.state = {
      searches: [],
      searchText: "",
      showQueries: false,
    }
    this.renderSearch = this.renderSearch.bind(this)
    this.search = this.search.bind(this)
    this.onSearchTextChange = this.onSearchTextChange.bind(this)
    this.mouseLeave = this.mouseLeave.bind(this)
    this.sendReq = this.sendReq.bind(this)
    this.addFriendToState = this.addFriendToState.bind(this)
    this.removeFriendReq = this.removeFriendReq.bind(this)
    this.acceptRequest = this.acceptRequest.bind(this)
    this.getToken = this.getToken.bind(this)
  }

  getToken() {
    var lsUserToken = getFromLocalStorage(storageKey)
    var ssUserToken = getFromSessionStorage(storageKey)
    if (lsUserToken) {
      return lsUserToken.token
    } else if (ssUserToken) {
      return ssUserToken.token
    } else {
      return null
    }
  }

  componentWillUnmount() {
    this._isMounted = false
    console.log('community has unmounted')
  }

  componentDidMount() {
    console.log("community has mounted")
    this._isMounted = true
  }

  removeFriendReq(id) {
    console.log("removing friend with id: ", id)
    var { friendRequests } = this.props.context
    // remove friend object from requests with id
    var removed = friendRequests.filter((friend) => {
      return friend.senderID !== id
    })
    console.log("removed", removed)
    this.setState({
      friendRequests: removed,
    })
  }

  addFriendToState(id, firstName, lastName) {
    var { friends } = this.props.context
    var friendObject = { id, firstName, lastName }
    this.setState({
      friends: [...friends, friendObject]
    })
  }

  onSearchTextChange(e) {
    this.setState({
      searchText: e.target.value
    })
  }

  search() {
    console.log("searching...")
    var { searchText } = this.state
    var userToken = this.getToken()

    var reqBody = {
      searchText,
      userToken,
    }

    if (this.state.searchText) {
      console.log("fetching...")
      fetch(searchURL, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(reqBody),
      })
        .then(res => res.json())
        .then((json) => {
          var { users } = json
          console.log(users)
          if (users) {
            this.setState({
              searches: users,
              showQueries: true,
            })
          }
        })
      .catch((err) => {throw err})
    }
  }

  mouseLeave() {
    // alert("left")
    this.setState({
      searchText: ""
    })
  }

  async decodeToken() {
    // send request to server to decode stored token into the user id
    var userToken = this.getToken()
    var headers = new Headers()
    headers.append("authorization", `Bearer ${userToken}`)
    var res = await fetch(tokenToID, {method: "GET", headers})
    var json = await res.json()
    var { userID } = json
    return userID
  }

  async sendReq(_id, firstName, lastName) {
    // emit event using web socket to server
    var { socket } = this.props.context
    var { userFirstName, userLastName } = this.props.context

    // get decoded userID
    var userID = await this.decodeToken()
    var userToken = this.getToken()
    console.log("sending request", userID)
    socket.emit("sendFriendRequest", {
      senderID: userID,
      senderFirstName: userFirstName,
      senderLastName: userLastName,
      receiverID: _id,
    })

    var body = JSON.stringify({
      token: userToken,
      userFirstName,
      userLastName,
      friend_id: _id,
      friendFirstName: firstName,
      friendLastName: lastName
    })

    fetch(friendReqURL, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body,
    })
      .then(res => res.json())
      .then((json) => {
        console.log(JSON.stringify(json))
      })
    .catch((err) => {throw err})
  }

  async acceptRequest(senderID, senderFirstName, senderLastName) {
    // SENDER refers to the FRIEND REQUEST SENDER
    var userToken = this.getToken()
    var { userFirstName, userLastName } = this.props.context
    // send notification to server
    var { socket } = this.props
    var userID = this.decodeToken()
    socket.emit("acceptFriendRequest", { userID, userFirstName, userLastName, otherFriendID: senderID })

    var reqBody = {
      userToken,
      userFirstName,
      userLastName,
      senderID,
      senderFirstName,
      senderLastName,
    }

    var res = await fetch(acceptFriendURL, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(reqBody)
    })
    var json = await res.json()
    console.log("json message: ", json.message)
  }

  renderSearch() {
    var liTags = []
    this.state.searches.forEach((user, i) => {
      var { firstName, lastName, _id } = user
      // capitalize first and last name before displaying
      firstName = firstName.charAt(0).toUpperCase() + firstName.slice(1)
      lastName  = lastName.charAt(0).toUpperCase() + lastName.slice(1)
      liTags.push(
        <div key={_id + "_search"} className="user-container">
          <li>{firstName}, {lastName}</li>
          <button onClick={() => {this.sendReq(_id, firstName, lastName)}}>
            friend {firstName}
          </button>
        </div>
      )
    })
    return liTags
  }

  render() {
    return (
      <div className="wrapper">
        <link
          rel="stylesheet"
          href="https://use.fontawesome.com/releases/v5.3.1/css/all.css"
          integrity="sha384-mzrmE5qonljUremFsqc01SB46JvROS7bZs3IO2EmfFsd15uHvIt+Y8vEf7N7fWAU"
          crossOrigin="anonymous"
        />
        <h4>Search for users</h4>
        <Searchbar
          search={this.search}
          onSearchTextChange={this.onSearchTextChange}
          mouseLeave={this.mouseLeave}
          searchText={this.state.searchText}
        />
        <div className={"queries" + (this.state.showQueries ? " expand" : " collapsed")}>
          {this.renderSearch()}
        </div>
        <FriendRequests
          userToken={this.getToken()}
          userFirstName={this.props.context.userFirstName}
          userLastName={this.props.context.userLastName}
          addFriendToState={this.addFriendToState}
          removeFriendReq={this.removeFriendReq}
          friendRequests={this.props.context.friendRequests}
          numRequests={this.props.context.numRequests}
          acceptRequest={this.acceptRequest}
        />
      </div>
    )
  }
}

export default Community
