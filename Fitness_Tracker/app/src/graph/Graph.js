import React, { Component } from 'react'
import Chart from './Chart'
import Carousel from "./carousel/Carousel"
import "./Graph.css"
class Graph extends Component {
  constructor(props) {
    super(props)

    this.state = {
      display: true,
      jumpJson: {
        action: "jumps",
        imageUrl: "https://img.icons8.com/ios/50/000000/trampoline-park-filled.png"
      },
      runJson: {
        action: "steps",
        imageUrl: "https://img.icons8.com/nolan/64/000000/running.png",
      },
      swimJson: {
        action: "laps",
        imageUrl: "https://img.icons8.com/nolan/64/000000/swimming.png"
      },
    }

    this.setRunData = this.setRunData.bind(this)
    this.setJumpData = this.setJumpData.bind(this)
    this.getActivityJson = this.getActivityJson.bind(this)
  }

  getActivityJson(activity) {
    var headers = new Headers()
    headers.append("id", "id") //change to be specific in future
    headers.append("activity", activity)

    return fetch('http://localhost:8080/data', {
      method: "GET",
      headers: headers,
    })
      .catch( (err) => {
        throw err
      })
      .then( (response) => {
        return response.json()
      })
      .catch( (err) => {
        throw err
      })
      .then((json) => {
        return json
      })
  }

  setJumpData() {
    var currentThis = this
    this.getActivityJson("jump").then(function(json) {
      currentThis.setState({
        jumpJson: {...currentThis.state.jumpJson, ...json}
      })
    })
  }

  setRunData() {
    var currentThis = this
    this.getActivityJson("run").then(function(json) {
      currentThis.setState({
        runJson: {...currentThis.state.runJson, ...json}
      })
    })
  }

  componentDidMount() {
    console.log("component did mount")
    this.setRunData()
    this.setJumpData()
    // this.setSwimData()
  }

  render() {
    return (
      <div>
        <Carousel
          activities={[
            this.state.jumpJson,
            this.state.runJson,
            this.state.swimJson
          ]}
        />
      </div>
    )
  }
}

export default Graph;
