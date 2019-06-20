import React, { Component } from 'react'
// import { Doughnut, Bar, Pie } from 'react-chartjs-2';
import DateBar from "./jumpComps/DateBar"
import Past from "./jumpComps/Past"

class RunDetails extends Component {
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
    headers.append("id", "id") //change to be specific in future
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
      .then((json) => {
        let chartLabels = this.makeLabels(json)
        let chartData = this.getData(json)
        this.setState({
          labels: chartLabels,
          data: chartData
        })
      })
  }

  // each label corresponds to 1 jump
  makeLabels(json) {
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
      <div>
        <DateBar
          labels={this.state.labels}
          data={this.state.data}
        />
        <Past
          labels={this.state.labels}
          data={this.state.data}
        />
      </div>
    )
  }
}
export default RunDetails
