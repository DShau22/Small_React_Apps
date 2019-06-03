import React, { Component } from 'react'
import { Doughnut, Bar, Pie, Line } from 'react-chartjs-2';

class Past extends Component {
  render() {
    return (
      <div>
        <Bar
          data={{
            labels: this.props.labels,
            datasets: [{
                label: 'awef',
                data: this.props.data,
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
            }]
          }}
          options={{
            maintainAspectRatio: true,
            title: {
              text: "Past",
              display: true,
              fontSize: 16
            },
            legend: {
              display: false,
              position: 'right'
            },
            responsive: true
          }}
        />
      </div>
    )
  }
}

export default Past
