import React, { Component } from 'react'
import { Line } from 'react-chartjs-2';

export default class LineProgression extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    var { labels, data, hoverLabel, activity, yAxisMin, yAxisMax, displayDate } = this.props
    /**
     * labels: for the x axis have time
     * data: paces data array
     * hoverLabel: "Pace"
     * activity: "Pace progression"
     * yaxisMin: 0
     * yaxisMax: some ratio of steps / time based on user config
     */
    return (
      <div>
        <Line
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
              text: `pace on ${displayDate()}`,
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
