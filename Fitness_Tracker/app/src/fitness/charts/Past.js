import React, { Component } from 'react'
import { Bar } from 'react-chartjs-2';

class Past extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    var { labels, data, hoverLabel, activity, yAxisMin, yAxisMax } = this.props
    return (
      <div>
        <Bar
          data={{
            labels: labels,
            datasets: [{
                label: hoverLabel,
                data: data,
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
            }]
          }}
          options={{
            maintainAspectRatio: true,
            title: {
              text: "Previous " + activity,
              display: true,
              fontSize: 16
            },
            legend: {
              display: false,
              position: 'right'
            },
            scales: {
              yAxes: [{
                ticks: {
                  min: yAxisMin,
                  max: yAxisMax
                }
              }]
            },
            responsive: true
          }}
        />
      </div>
    )
  }
}

export default Past
