import React, { Component } from 'react'
import Carousel from "../carousel/Carousel"
import Calories from "../Calories"
import Duration from "../Duration"
import Details from "../Details"
import SpaContext from '../../Context'
import Chart from "../Chart"
const jumpLink = "/app/jumpDetails"
const runLink = "/app/runDetails"
const swimLink = "/app/swimDetails"

class Run extends Component {
  constructor(props) {
    super(props)
    this.state = {
      activityIndex: 0, 
    }
    this.nextSlide = this.nextSlide.bind(this);
    this.previousSlide = this.previousSlide.bind(this);
  }

  previousSlide() {
    console.log("prev")
    //debugger
    var { activityData } = this.props.stats
    var nextIndex = Math.min((this.state.activityIndex + 1), activityData.length - 1)
    this.setState({
      activityIndex: nextIndex
    });
  }

  nextSlide() {
    // 0 represents the most recent upload date
    var nextIndex = Math.max((this.state.activityIndex - 1), 0)
    this.setState({
      activityIndex: nextIndex
    })
  }

  render() {
    var { stats, context } = this.props
    var { activityIndex } = this.state
    var currentStatDisplay = stats.activityData[activityIndex]
//    debugger
    return (
      <div>
        <div className="row">
          <div className="col">
            <Carousel
              stats={stats}
              context={context}
              previousSlide={this.previousSlide}
              nextSlide={this.nextSlide}
              activityIndex={this.state.activityIndex}  
            />
          </div>
        </div>
        <div className="row">
          <div className="col-4" align="center">
            <Calories cals={currentStatDisplay.calories}/>
          </div>
          <div className="col-4" align="center">
            <Details detailsLink={runLink}/>
          </div>
          <div className="col-4" align="center">
            <Duration duration={currentStatDisplay.time}/>
          </div>
        </div>
        <div className="row">
          <Chart />
        </div>
      </div>
    )
  }
}

Run.contextType = SpaContext
export default Run
