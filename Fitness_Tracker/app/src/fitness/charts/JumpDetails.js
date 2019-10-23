import React, { Component } from 'react'
// import { Doughnut, Bar, Pie } from 'react-chartjs-2';
import DateBar from "./DateBar"
import Past from "./Past"
import {
  NavLink,
} from "react-router-dom";
import {
  getToken,
  localStorageKey
} from '../../utils/storage'

class JumpDetails extends Component {
  constructor(props) {
    super(props)
    this.state = {
      labels: [],
      data: [],
    }

    this.setJumpData = this.setJumpData.bind(this)
  }

  componentDidMount() {
    this.setJumpData()
  }
  // fetches data by making request to server
  // updates the state if successfull
  setJumpData() {

    var headers = new Headers()
    var token = getToken(localStorageKey)
    headers.append("authorization", `Bearer ${token}`)
    headers.append("activity", "jump")

    fetch('http://localhost:8080/data', {
      method: "GET",
      headers: headers,
    })
      .catch( (err) => {
        throw err
      })
      .then( (response) => {
        return response.json()
      })
      .catch((err) => {throw err})
      .then((json) => {
        if (json.success) {
          var { activityData } = json
          // assign data, labels to the chart
          let chartLabels = this.makeLabels(activityData)
          let chartData = this.getData(activityData)
          this.setState({
            labels: chartLabels,
            data: chartData
          })
        } else {
          alert("couldn't request data")
          console.log(json)
        }
      })
  }

  // each label corresponds to 1 jump
  makeLabels(json) {
    debugger
    var labels = []
    for (var i = 1; i < json.heights.length + 1; i++) {
      labels.push(i)
    }
    return labels
  }

  // each data entry is a vertical height in inches
  getData(json) {
    var data = []
    var heights = json.heights
    heights.forEach(h => {
      data.push(h)
    })
    return data
  }

  render() {
    return (
      <div style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
      }}>
        <DateBar
          labels={this.state.labels}
          data={this.state.data}
        />
        <Past
          labels={this.state.labels}
          data={this.state.data}
        />
        <NavLink
          className="routeButton"
          id="backFromJumpDetails"
          to="/graph"
          style={{
            marginTop: "20px"
          }}
        >
          Back
        </NavLink>
      </div>
    )
  }
}

export default JumpDetails
