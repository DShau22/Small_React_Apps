import React, { Component } from 'react'
import Carousel from "./carousel/Carousel"
import Run from "./run/Run"
import Jump from "./jump/Jump"
import Swim from "./swim/Swim"
import "./Fitness.css"
import SpaContext from "../Context"
import {
  getFromLocalStorage,
  getFromSessionStorage,
  storageKey
} from '../utils/storage'

function getToken() {
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

class Fitness extends Component {
  constructor(props) {
    super(props)

    this.state = {
      display: true,
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
      activityDisplay: "", // which activity to display
    }

    // this.setRunData = this.setRunData.bind(this)
    // this.setJumpData = this.setJumpData.bind(this)
    // this.setSwimData = this.setSwimData.bind(this)
    // this.getActivityJson = this.getActivityJson.bind(this)
    this.renderActivity = this.renderActivity.bind(this)
    this.changeActivityDisplay = this.changeActivityDisplay.bind(this)
  }

  renderActivity() {
    // debugger
    var { activityDisplay } = this.state
    var { runJson, swimJson, jumpJson } = this.context
    if (activityDisplay === "run") {
      return ( <div> <Run stats={runJson}/> </div> )
    } else if (activityDisplay === "jump") {
      return ( <div> <Jump stats={swimJson}/> </div> )
    } else if (activityDisplay === "swim") {
      return ( <div> <Swim stats={jumpJson}/> </div> )
    } else {
      return ( <div> <span>pick an activity</span> </div>)
      // alert("activityDisplay in the state is not run, jump, or swim...")
    }
  }

  changeActivityDisplay(activity) {
    //debugger;
    this.setState({
      activityDisplay: activity
    })
  }

  // async getActivityJson(activity) {
  //   // CHANGE TO GET THE FIRST 10-50 ENTRIES MAYBE
  //   var headers = new Headers()
  //   var token = getToken(storageKey)
  //   headers.append("authorization", `Bearer ${token}`)
  //   headers.append("activity", activity)

  //   var res = await fetch('http://localhost:8080/data', {
  //     method: "GET",
  //     headers: headers,
  //   })
  //   var trackedFitness = await res.json()
  //   return trackedFitness
  // }

  // async setJumpData() {
  //   var jumpsTracked = await this.getActivityJson("jump")
  //   this.setState(prevState => ({
  //     jumpJson: {
  //       ...prevState.jumpJson,
  //       activityData: jumpsTracked.activityData 
  //     }
  //   }))
  // }

  // async setRunData() {
  //   var runsTracked = await this.getActivityJson("run")
  //   this.setState(prevState => ({
  //     runJson: {
  //       ...prevState.runJson,
  //       activityData: runsTracked.activityData 
  //     }
  //   }))
  // }

  // async setSwimData() {
  //   var swimsTracked = await this.getActivityJson("swim")
  //   this.setState(prevState => ({
  //     swimJson: {
  //       ...prevState.swimJson,
  //       activityData: swimsTracked.activityData 
  //     }
  //   }))
  // } 

  async componentDidMount() {
    console.log("component did mount")
    // await this.setRunData()
    // await this.setJumpData()
    // await this.setSwimData()
  }

  render() {
    return (
      <div>
        <nav className="navbar navbar-expand navbar-text sticky-top navbar-dark bg-dark">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item mx-4">
              <span className="nav-link" onClick={() => {this.changeActivityDisplay("run")}} >Run</span>
            </li>
            <li className="nav-item mx-4">
              <span className="nav-link" onClick={() => {this.changeActivityDisplay("swim")}}>Swim</span>
            </li>
            <li className="nav-item mx-4">
              <span className="nav-link" onClick={() => {this.changeActivityDisplay("jump")}}>Jump</span>
            </li>
          </ul>
        </nav>
        {this.renderActivity()}
      </div>
    )
  }
}

// consume the context provided by the SPA
Fitness.contextType = SpaContext

export default Fitness;
