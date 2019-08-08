import React, { Component } from 'react'
import './App.css'
import {
  Route,
  NavLink,
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
import ContextRoute from "./ContextRoute"
import Home from "./home/Home"
import Community from "./community/Community"
import Graph from "./graph/Graph"
import RunDetails from "./graph/charts/RunDetails"
import SwimDetails from "./graph/charts/SwimDetails"
import JumpDetails from "./graph/charts/JumpDetails"
import Profile from "./profile/Profile"
import EditProfile from "./profile/EditProfile"
import Settings from "./settings/Settings"
import Advanced from "./settings/Advanced"
import Personal from "./settings/Personal"
import Security from "./settings/Security"
import Stats from "./settings/Stats"
import Navbar from "./generic/Navbar"

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
      friendsPending: [],
      firstName: "",
      lastName: "",
      username: "",
      gender: "",
      bio: "",
      height: "",
      weight: "",
      profilePicture: "",
      settings: {},
      isLoading: false,
      logout: false,
      socket: null,
      notification: null,
      mounted: false,
      rootURL: this.props.match.url
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
    console.log(json)
    if (json.success && this._isMounted) {
      // one bug that could come up is if another setState occurred outside this function before
      // the fetch response finished running. This delayed setState would then
      // run after the other setState which could cause some mixups in which state is correct
      // Shouldn't be a problem thoughsince the socket field is only updated here and users can't see it.
      this.setState({
        ...json,
        socket,
        mounted: true
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
    console.log("rendering spa...")
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
          <div className="container">
              <BrowserRouter>
                <div className="row">
                  <p>Account</p>
                </div>
                <div className="row">
                  <button onClick={this.logout}>Logout</button>
                  <NavLink activeClassName="navLink" to={{pathname: `${match.url}/settings`}}>Settings</NavLink>
                </div>
                <div className="App">
                  <Navbar
                    homeURL="/app"
                    communityURL={`${match.url}/community`}
                    fitnessURL={`${match.url}/graph`}
                    profileURL={`${match.url}/profile/${this.state.username}`}
                  />
                  <div className="Card">
                    <Switch>
                      <Route exact path="/app" component={Home}/>
                      <ContextRoute path={`${match.url}/community`} contextComp={SpaContext} component={Community}/>
                      <Route path={`${match.url}/graph`} component={Graph}/>
                      <Route path={`${match.url}/jumpDetails`} component={JumpDetails}/>
                      <Route path={`${match.url}/swimDetails`} component={SwimDetails}/>
                      <Route path={`${match.url}/runDetails`} component={RunDetails}/>
                      <ContextRoute exact path={`${match.url}/profile/:username?`} contextComp={SpaContext} component={Profile}/>
                      <ContextRoute path={`${match.url}/profile/:username?/edit`} contextComp={SpaContext} component={EditProfile}/>
                      <ContextRoute exact path={`${match.url}/settings`} contextComp={SpaContext} component={Settings}/>
                      <ContextRoute path={`${match.url}/settings/personal`} contextComp={SpaContext} component={Personal}/>
                      <ContextRoute path={`${match.url}/settings/security`} contextComp={SpaContext} component={Security}/>
                      <ContextRoute path={`${match.url}/settings/stats`} contextComp={SpaContext} component={Stats}/>
                      <ContextRoute path={`${match.url}/settings/advanced`} contextComp={SpaContext} component={Advanced}/>
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
