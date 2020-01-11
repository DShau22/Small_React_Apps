import {
  getToken,
} from '../utils/storage';
import {
  NavLink,
} from "react-router-dom";

import React, { Component } from 'react'
import Searchbar from "./Searchbar"
import FriendRequests from "./friends/FriendRequests"
import Header from "./header/Header.js"
import Friends from "./friends/Friends"

import SpaContext from '../Context'
import "./style/Community.css"
const searchURL = "http://localhost:8080/searchUser"
const friendReqURL = "http://localhost:8080/sendFriendReq"
// const getUserInfoURL = "http://localhost:8080/getUserInfo"
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
      emptySearch: false,
      numFriendsDisplay: 25,
    }
    this.renderSearch = this.renderSearch.bind(this)
    this.search = this.search.bind(this)
    this.onSearchTextChange = this.onSearchTextChange.bind(this)
    this.mouseLeave = this.mouseLeave.bind(this)
    this.sendReq = this.sendReq.bind(this)
    this.addFriendToState = this.addFriendToState.bind(this)
    this.removeFriendReq = this.removeFriendReq.bind(this)
    this.acceptRequest = this.acceptRequest.bind(this)
    this.clearSearch = this.clearSearch.bind(this)
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
    var { friendRequests } = this.context
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
    var { friends } = this.context
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

  async search() {
    console.log("searching...")
    var { searchText } = this.state
    var userToken = getToken()

    var reqBody = {
      searchText,
      userToken,
    }

    if (this.state.searchText) {
      console.log("fetching...")
      var res = await fetch(searchURL, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(reqBody),
      })
      var json = await res.json()
      var { users } = json
      if (users === undefined || users.length === 0) {
        this.setState({
          emptySearch: true,
        })
      } else {
        this.setState({
          searches: users,
          showQueries: true,
          emptySearch: false
        })
      }
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
    var userToken = getToken()
    var headers = new Headers()
    headers.append("authorization", `Bearer ${userToken}`)
    var res = await fetch(tokenToID, {method: "GET", headers})
    var json = await res.json()
    var { userID } = json
    return userID
  }

  async sendReq(_id, receiverFirstName, receiverLastName, receiverUsername) {
    // emit event using web socket to server
    var { socket } = this.context
    var { firstName, lastName, username } = this.context

    // get decoded userID
    var userID = await this.decodeToken()
    var userToken = getToken()
    console.log("sending request", userID)
    socket.emit("sendFriendRequest", {
      senderID: userID,
      senderFirstName: firstName,
      senderLastName: lastName,
      senderUsername: username,
      receiverID: _id,
    })

    var body = JSON.stringify({
      token: userToken,
      senderFirstName: firstName,
      senderLastName: lastName,
      senderUsername: username,
      receiverID: _id,
      receiverFirstName,
      receiverLastName,
      receiverUsername,
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
    var userToken = getToken()
    var { firstName, lastName } = this.context
    // send notification to server
    var { socket } = this.context
    var userID = this.decodeToken()
    socket.emit("acceptFriendRequest", { userID, receiverFirstName: firstName, receiverLastName: lastName, otherFriendID: senderID })

    var reqBody = {
      userToken,
      receiverFirstName: firstName,
      receiverLastName: lastName,
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

  clearSearch() {
    // set search state data to inital state
    this.setState({
      searchText: "",
      searches: [],
      showQueries: false,
      emptySearch: false,
    })
  }

  renderSearch() {
    var liTags = []
    var { searches, emptySearch } = this.state
    var { friends, friendRequests, friendsPending, rootURL } = this.context

    // put the user ids into a set for easy lookup
    // apparently these constructors don't work on IE 11
    var friendSet = new Set(friends.map(user => user.id))
    var requestSet = new Set(friendRequests.map(user => user.id))
    var pendingSet = new Set(friendsPending.map(user => user.id))

    // if user just searched name not in database
    if (emptySearch) {
      liTags.push(
        <div className="empty-search-container" key="empty-key">
          <span>no search results :(</span>
        </div>
      )
    }

    var displayButton = (user, friendSet, requestSet, pendingSet) => {
      // console.log(user, friendSet, requestSet, pendingSet)
      var { firstName, lastName, _id, username} = user
      if (friendSet.has(_id)) {
        return (
          <span> already friends </span>
        )
      } else if (requestSet.has(_id)) {
        return (
          <button
            onClick={() => {
              this.acceptRequest(_id, firstName, lastName)
              this.removeFriendReq(_id)
              this.addFriendToState(_id, firstName, lastName)
            }}
          >
            accept
          </button> 
        )
      } else if (pendingSet.has(_id)) {
        return ( <span> request sent </span> )
      } else {
        return (
          <button onClick={() => {this.sendReq(_id, firstName, lastName, username)}}>
            friend {firstName}
          </button>
        )
      }
    }

    searches.forEach((user, i) => {
      var { firstName, lastName, _id, username } = user
      
      // capitalize first and last name before displaying
      firstName = firstName.charAt(0).toUpperCase() + firstName.slice(1)
      lastName  = lastName.charAt(0).toUpperCase() + lastName.slice(1)
      liTags.push(
        <div key={_id + "_search"} className="user-container">
          <NavLink to={{pathname: `${rootURL}/profile/${username}`}} style={{"cursor": "pointer"}}>
            {firstName}, {lastName}
          </NavLink>
          {displayButton(user, friendSet, requestSet, pendingSet)}
        </div>
      )
    })

    liTags.push(
      <div className="clear-search-container" key="clear-search-container">
        <button onClick={this.clearSearch}>clear search</button>
      </div>
    )
    return liTags
  }

  render() {
    var { context } = this
    return (
      //<Header />
      <div className="wrapper">
        <Header />
        <Friends renderFriends={this.renderFriends}/>
        <div className="searchbar-wrapper">
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
        </div>
        {/* just set contexttype of friendRequests later */}
        <FriendRequests
          userToken={getToken()}
          userFirstName={context.userFirstName}
          userLastName={context.userLastName}
          addFriendToState={this.addFriendToState}
          removeFriendReq={this.removeFriendReq}
          friendRequests={context.friendRequests}
          friendsPending={context.friendsPending}
          friends={context.friends}
          numRequests={context.numRequests}
          acceptRequest={this.acceptRequest}
        />
      </div>
    )
  }
}

Community.contextType = SpaContext

export default Community
