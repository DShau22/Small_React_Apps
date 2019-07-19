import React, { Component } from 'react'
import './App.css'
import {
  Route,
  NavLink,
  HashRouter,
  Redirect,
  BrowserRouter,
  Switch
} from "react-router-dom";
import {
  getFromLocalStorage,
  removeFromLocalStorage,
  getFromSessionStorage,
  removeFromSessionStorage,
  storageKey,
} from './utils/storage';
import Home from "./Home"
import Community from "./community/Community"
import Graph from "./graph/Graph"
import RunDetails from "./graph/charts/RunDetails"
import SwimDetails from "./graph/charts/SwimDetails"
import JumpDetails from "./graph/charts/JumpDetails"
import Profile from "./profile/Profile"

// web sockets
import io from "socket.io-client"

// server url
const serverURL = "http://localhost:8080"
const getUserInfoURL = serverURL + "/getUserInfo"
const getID = "/tokenToID"

// create context for storing socket throughout the Spa
const SpaContext = React.createContext()

class Spa extends Component {
  _isMounted = false
  constructor(props) {
    super(props)
    this.state = {
      friends: [],
      friendRequests: [],
      numRequests: 0,
      userFirstName: "",
      userLastName: "",
      username: "",
      isLoading: false,
      logout: false,
      socket: null,
      notification: null,
    }
    this.logout = this.logout.bind(this);
    this.setUpSocket = this.setUpSocket.bind(this)
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

  setUpSocket() {
    var prom = new Promise(async (resolve, reject) => {
      // send request to get decoded user ID
      var userToken = this.getToken()
      var headers = new Headers()
      headers.append("authorization", `Bearer ${userToken}`)
      var response = await fetch(serverURL + getID, { method: "GET", headers })
      var json = await response.json()
      var { userID } = json

      // establish socket connection and send socket ID, userID
      var data = { userID }
      var connectionOptions = {
        'sync disconnect on unload':false
      }
      var socket = io.connect(serverURL, connectionOptions)

      // send userID after socket connects
      socket.on("connect", () => {
        socket.emit("sendUserID", data)
        // put socket is session storage
      })

      socket.on('receiveFriendRequest', (data) => {
        alert("got friend request!")
        console.log(data)
        this.setState({
          notification: "!"
        })
      })

      socket.on("newFriend", (data) => {
        alert("got new friend")
        console.log(data)
        this.setState({
          notification: "***"
        })
      })

      socket.on("logoutClient", (data) => {
        // data should contain the socketID that did the logging out
        // socket should have also been disconnected by the server
        var { logoutSocketID } = data
        console.log(logoutSocketID)
        if (socket.id !== logoutSocketID) {
          alert("You have been logged out from another tab or browser")
        }
        // remove user token
        removeFromLocalStorage(storageKey)
        removeFromSessionStorage(storageKey)
        // remove socket id from session storage
        this.setState({
          isLoading: true,
          logout: true,
        });
      })
      resolve(socket)
    })
    return prom
  }

  async componentDidMount() {
    this._isMounted = true
    console.log("spa has mounted...")
    // if there is no token then user hasn't logged in...
    // log them out and redirect them back to login page
    var userToken = this.getToken()
    if (!userToken) {
      this.setState({
        logout: true
      })
      return
    }

    console.log("setting up socket")
    // set up the web socket connection to server
    var socket = await this.setUpSocket()

    // get the user's information here from database
    // make request to server to user information and set state
    var headers = new Headers()
    headers.append("authorization", `Bearer ${userToken}`)

    var res = await fetch(getUserInfoURL, { method: "GET", headers })
    var json = await res.json()
    if (json.success && this._isMounted) {
      var { firstName, lastName, username, friends, friendRequests } = json
      // one bug that could come up is if another setState occurred outside this function before
      // the fetch response finished running. This delayed setState would then
      // run after the other setState which could cause some mixups in which state is correct
      // Shouldn't be a problem thoughsince the socket field is only updated here and users can't see it.
      this.setState({
        friends,
        friendRequests,
        numRequests: friendRequests.length,
        userFirstName: firstName,
        userLastName: lastName,
        username,
        socket
      })
    }
  }

  componentWillUnmount() {
    this._isMounted = false
    console.log("unmounting spa")
  }

  logout() {
    console.log("logging out...")
    var { socket } = this.state
    console.log(socket)

    // emit logout event to server
    var userToken = this.getToken()
    var data = {
      userToken
    }
    socket.emit("logoutServer", data)
  }

  render() {
    const { logout, socket } = this.state
    // console.log("socket is: ", socket)
    // console.log(socket)
    if (logout) {
      return (
        <Redirect to="/login" />
      )
    } else {
      var { match } = this.props
      return (
        <SpaContext.Provider value={this.state}>
          <div className="outerContainer">
            <div>
              <p>Account</p>
              <button onClick={this.logout}>Logout</button>
            </div>
              <BrowserRouter>
                <div className="App">
                  <ul className="header">
                    <li><NavLink activeClassName = "navLink" exact to="/app">Home page</NavLink></li>
                    <li>
                      <NavLink activeClassName="navLink" to={{pathname: `${match.url}/community`,}}>
                        Community
                      </NavLink>
                      <div className="community-notification">{this.state.notification}</div>
                    </li>
                    <li><NavLink activeClassName = "navLink" to={{pathname: `${match.url}/graph`}}>Progress</NavLink></li>
                    <li><NavLink activeClassName = "navLink" to={{pathname: `${match.url}/profile`}}>Profile</NavLink></li>
                  </ul>
                  <div className="Card">
                    <Switch>
                      <Route exact path="/app" component={Home}/>
                      <Route path={`${match.url}/community`}>
                        <SpaContext.Consumer>
                          {(context) => (<Community
                                          context={context}
                                        />)}
                        </SpaContext.Consumer>
                      </Route>
                      <Route path={`${match.url}/graph`} component={Graph}/>
                      <Route path={`${match.url}/jumpDetails`} component={JumpDetails}/>
                      <Route path={`${match.url}/swimDetails`} component={SwimDetails}/>
                      <Route path={`${match.url}/runDetails`} component={RunDetails}/>
                      <Route path={`${match.url}/profile`} component={Profile}/>
                    </Switch>
                  </div>
                </div>
              </BrowserRouter>
          </div>
        </SpaContext.Provider>
      )
    }
  }
}

export default Spa
