import React, { Component } from "react";
import SpaContext from "../Context"
import Community from "../community/Community"
import Fitness from "../fitness/Fitness"
import RunDetails from "../fitness/run/RunDetails"
import SwimDetails from "../fitness/swim/SwimDetails"
import JumpDetails from "../fitness/jump/JumpDetails"
import Profile from "../profile/Profile"
import EditProfile from "../profile/EditProfile"
import Settings from "../settings/Settings"
import Advanced from "../settings/Advanced"
import Personal from "../settings/Personal"
import Security from "../settings/Security"
import Stats from "../settings/Stats"
import Navbar from "../generic/Navbar"
import Home from "./Home";

import SideNav, { Toggle, Nav, NavItem, NavIcon, NavText } from '@trendmicro/react-sidenav';

// Be sure to include styles at some point, probably during your bootstraping
import '@trendmicro/react-sidenav/dist/react-sidenav.css';
import './header.css'
// for router transitions
import {
  TransitionGroup,
  CSSTransition
} from "react-transition-group"
import "../transitions.css"

// web sockets
import io from "socket.io-client"

import {
  getBests,
  getProfile,
  getUsername
} from "../utils/userInfo"

import {
  Route,
  NavLink,
  withRouter,
  Switch
} from "react-router-dom";

import {
  getToken,
  removeFromLocalStorage,
  removeFromSessionStorage,
  storageKey,
} from '../utils/storage';

// server url
const serverURL = "http://localhost:8080"
const getUserInfoURL = serverURL + "/getUserInfo"
const getID = "/tokenToID"
const defaultProfile = "./profile/default_profile.png"
const root = "/app"

class Header extends Component {
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
      rootURL: this.props.match.url,
      friendTableRows: [],
      numFriendsDisplay: 25,
      jumpJson: {
        activityData: [],
        action: "jump",
        imageUrl: "https://img.icons8.com/ios/50/000000/trampoline-park-filled.png"
      },
      runJson: {
        activityData: [],
        action: "run",
        imageUrl: "https://img.icons8.com/nolan/64/000000/running.png",
      },
      swimJson: {
        activityData: [],
        action: "swim",
        imageUrl: "https://img.icons8.com/nolan/64/000000/swimming.png"
      },
    }
    this.logout = this.logout.bind(this);
    this.setUpSocket = this.setUpSocket.bind(this)
    this.getActivityJson = this.getActivityJson.bind(this)
    this.addFriendRows = this.addFriendRows.bind(this)
    this.renderHeader = this.renderHeader.bind(this)
  }

  setUpSocket() {
    var prom = new Promise(async (resolve, reject) => {
      // send request to get decoded user ID
      var userToken = getToken()
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
        this.props.history.push("/")
      })
      resolve(socket)
    })
    return prom
  }

  async getActivityJson(activity) {
    // CHANGE TO GET THE FIRST 10-50 ENTRIES MAYBE
    var headers = new Headers()
    var token = getToken()
    headers.append("authorization", `Bearer ${token}`)
    headers.append("activity", activity)

    var res = await fetch('http://localhost:8080/data', {
      method: "GET",
      headers: headers,
    })
    var trackedFitness = await res.json()
    return trackedFitness
  }
  visitProfile(username) {
    // this.props.history.push(`/app/profile/${username}`)
    //debugger
    console.log("visiting...")
  }

  /**
   * for each friend in the friend array, return
   * a table row to show in the friends table
   */  
  async addFriendRows(friends, numFriendsDisplay) {
    var tableRows = []
    for (var i = 0; i < friends.length; i++) {
      if (i === numFriendsDisplay - 1) { break }
      var { id, firstName, lastName } = friends[i]
      // should return [bests (object), profileURL (string), username (string)]
      var userInfo = await Promise.all([getBests(id), getProfile(id), getUsername(id)])
      console.log(userInfo)
      var bests = userInfo[0]
      var profileUrl = userInfo[1]
      var username = userInfo[2]
      tableRows.push(
        <tr 
          key={id} 
          onClick={() => { this.props.history.push(`/app/profile/${username}`) }}
          className="friend-row"
        >
          <th scope="col">{i + 1}</th>
          <td>
            <img src={(profileUrl ? profileUrl : defaultProfile)} height="35" width="35" />
          </td>
          <td>{firstName} {lastName}</td>
          <td>{(bests.run > 0) ? bests.run : "N/A"}</td>
          <td>{(bests.jump > 0) ? bests.jump : "N/A"}</td>
          <td>swim</td>
        </tr>
      )
    }
    return tableRows
  }

  async componentDidMount() {
    this._isMounted = true
    console.log("header has mounted...")
    // if there is no token then user hasn't logged in...
    // log them out and redirect them back to login page,
    // and don't run the rest of this method cuz it involves setting
    // up stuff as if the user had logged in
    var userToken = getToken()
    if (!userToken) {
      this.setState({
        logout: true
      })
      this.props.history.push("/")
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
    var userJson = await res.json()
    console.log(userJson)

    var { numFriendsDisplay } = this.state
    var friendTableRows = await this.addFriendRows(userJson.friends, numFriendsDisplay)

    // get user's fitness data for jumps, runs, swims
    // MAKE AWAIT PROMISES.ALL LATER
    var jumpsTracked = await this.getActivityJson("jump")
    var swimsTracked = await this.getActivityJson("swim")
    var runsTracked = await this.getActivityJson("run")
    var gotAllInfo = userJson.success && jumpsTracked.success && swimsTracked.success && runsTracked.success
    console.log(gotAllInfo)
    if (gotAllInfo && this._isMounted) {
      console.log("state setting")
      // one bug that could come up is if another setState occurred outside this function before
      // the fetch response finished running. This delayed setState would then
      // run after the other setState which could cause some mixups in which state is correct
      // Shouldn't be a problem thoughsince the socket field is only updated here and users can't see it.
      this.setState(prevState => ({
        ...userJson,
        socket,
        mounted: true,
        friendTableRows,
        jumpJson: {
          ...prevState.jumpJson,
          activityData: jumpsTracked.activityData 
        },
        runJson: {
          ...prevState.runJson,
          activityData: runsTracked.activityData 
        },
        swimJson: {
          ...prevState.swimJson,
          activityData: swimsTracked.activityData 
        }
      }))
    } else {
      alert("not success")
    }
  }

  componentWillUnmount() {
    this._isMounted = false
    console.log("unmounting header...")
  }

  logout() {
    console.log("logging out...")
    var { socket } = this.state
    console.log(socket)

    // emit logout event to server
    var userToken = getToken()
    var data = { userToken }
    socket.emit("logoutServer", data)
  }

  renderHeader() {
    var { match } = this.props
    // if there is a token in session or local storage...
    if (getToken()) {
      return (
        <div className="header w-100">
          <div className="d-flex align-items-center w-100 h-100">
            <div className="ml-3 mt-auto mb-auto">
              <Navbar
                homeURL="/app"
                communityURL={`${match.url}/community`}
                fitnessURL={`${match.url}/fitness`}
                profileURL={`${match.url}/profile/${this.state.username}`}
                settingsURL={`${match.url}/settings`}
                logout={this.logout}
              />
            </div>
            <span className='position-absolute w-100'>
              title display
            </span>
          </div>
        </div>
      )
    } else {
      // no token, redirect to login
      alert('no token in the storage...')
      this.props.history.push("/")
    }
  }
  render() {
    return (
      <div className="home-container">
        <SpaContext.Provider value={this.state}>
          {this.renderHeader()} 
          <div className="card text-center m-3">
            <div className='card-body'>
              <TransitionGroup>
                <CSSTransition
                  key={this.props.location.key}
                  timeout={1000}
                  classNames="fade"
                  appear
                >
                  <Switch location={this.props.location}>
                    <Route exact path={`${root}`} component={Home}/>
                    <Route path={`${root}/community`} component={Community}/>
                    <Route path={`${root}/fitness`} component={Fitness}/>
                    <Route path={`${root}/jumpDetails`} component={JumpDetails}/>
                    <Route path={`${root}/swimDetails`} component={SwimDetails}/>
                    <Route path={`${root}/runDetails`} component={RunDetails}/>
                    <Route exact path={`${root}/profile/:username?`} component={Profile}/>
                    <Route path={`${root}/profile/:username?/edit`} component={EditProfile}/>
                    <Route exact path={`${root}/settings`} component={Settings}/>
                    <Route path={`${root}/settings/personal`} component={Personal}/>
                    <Route path={`${root}/settings/security`} component={Security}/>
                    <Route path={`${root}/settings/stats`} component={Stats}/>
                    <Route path={`${root}/settings/advanced`} component={Advanced}/>
                  </Switch>
                </CSSTransition>
              </TransitionGroup>
            </div>
          </div>
        </SpaContext.Provider>
      </div>
    )
  }
}

export default withRouter(Header);
