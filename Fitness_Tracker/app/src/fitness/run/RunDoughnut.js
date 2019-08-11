import React from 'react'
import Doughnut from "react-chartjs-2"
export default function RunDoughnut( props ) {
  console.log(props.data)
  return (
    <div>
      <Doughnut
        data={{
          datasets: [{
            data: props.data,
          }],
          labels: props.labels
        }}
        options={{
          responsive: false
        }}
      />
    </div>
  )
}
