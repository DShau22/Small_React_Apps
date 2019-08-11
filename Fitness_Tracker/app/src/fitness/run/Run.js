import React, { Component } from 'react'
import Carousel from "../carousel/Carousel"
import Calories from "../Calories"
import Duration from "../Duration"
import Details from "../Details"
import SpaContext from '../../Context'
import Past from "../charts/Past"
import { parseDate } from "../../utils/unitConverter"
import RunDoughnut from "./RunDoughnut"
import withFitnessPage from "../withFitnessPage"
const jumpLink = "/app/jumpDetails"
const runLink = "/app/runDetails"
const swimLink = "/app/swimDetails"

// btw restPaceMin and walkPaceMax is walking
// greater that walkPaceMax is running
const walkPaceMax = 2.314 // 130 steps per minute is a fast walk, which is 2.16 steps/sec, 2.314 (.2sec) / step
// anything above restPaceMax is resting
const restPaceMin = 5 // say 60 steps per minute is basically resting. 1 step/sec, 5 (.2sec) / step

class Run extends Component {
  constructor(props) {
    super(props)
    this.state = {
      paceLabels: [],
      paceDate: [], 
    }
    // this.nextSlide = this.nextSlide.bind(this);
    // this.previousSlide = this.previousSlide.bind(this);
    // this.makePastGraphLabels = this.makePastGraphLabels.bind(this)
    // this.makePastGraphData = this.makePastGraphData.bind(this)
    // this.dropdownItemClick = this.dropdownItemClick.bind(this)
    // this.displayDate = this.displayDate.bind(this)
    // this.calcAvgSteps = this.calcAvgSteps.bind(this)
    // this.calcAvgCals = this.calcAvgCals.bind(this)
    // this.calcAvgPace = this.calcAvgPace.bind(this)
  }

  componentDidMount() {
    console.log('mounted')
    // this.props.makePastGraphLabels()
    // this.props.makePastGraphData()
  }

  // gets the labels for the graph that displays # steps over time 
  // makePastGraphLabels() {
  //   var pastGraphLabels = []
  //   this.context.runJson.activityData.forEach((session, idx) => {
  //     var { uploadDate } = session
  //     var stringToDate = new Date(uploadDate)
  //     // this is an array
  //     var dateInfo = parseDate(stringToDate)
  //     pastGraphLabels.push(dateInfo[0] + ", " + dateInfo[1] + " " + dateInfo[2])
  //   })
  //   this.setState({ pastGraphLabels })
  // }

  // makePastGraphData() {
  //   var pastGraphData = []
  //   this.context.runJson.activityData.forEach((session, idx) => {
  //     var { num } = session
  //     pastGraphData.push(num)
  //   })
  //   this.setState({ pastGraphData })
  //   //debugger
  // }

  // displayDate() {
  //   var { runJson } = this.context
  //   var { activityIndex } = this.state
  //   var { uploadDate } = runJson.activityData[activityIndex]
  //   var parsed = parseDate(new Date(uploadDate))
  //   var date = parsed[0] + ", " + parsed[1] + " " + parsed[2]
  //   return date
  // }

  // dropdownItemClick(e) {
  //   // on dropdown date click, display that date on the dropdown,
  //   // and switch the image slider to display that date
  //   this.setState({ activityIndex: parseInt(e.target.id) })
  //}

  makeDoughnutData() {
    var runCount = 0
    var walkCount = 0
    var count = 0
    var { activityData } = this.context.runJson
    activityData.forEach((session, i) => {
      session.pace.forEach((pace, j) => {
        if (pace > walkPaceMax) {
          runCount += 1
        } else if (pace > restPaceMin && pace < walkPaceMax) {
          walkCount += 1
        }
        count += 1
      })
    })
    if (count === 0) {
      return [0, 0, 0]
    }
    var runPercent = runCount / count
    var walkPercent = walkCount / count
    return [runPercent, walkPercent, 1 - (runPercent + walkPercent)]
  }

  // previousSlide() {
  //   //debugger
  //   var { activityData } = this.context.runJson
  //   var nextIndex = Math.min((this.state.activityIndex + 1), activityData.length - 1)
  //   this.setState({ activityIndex: nextIndex })
  // }

  // nextSlide() {
  //   // 0 represents the most recent upload date
  //   var nextIndex = Math.max((this.state.activityIndex - 1), 0)
  //   this.setState({ activityIndex: nextIndex })
  // }

  // calculates average number of steps over all the documents queried
  // calcAvgSteps() {
  //   var { activityData } = this.context.runJson
  //   var avg = 0
  //   var count = 0
  //   activityData.forEach((session, idx) => {
  //     avg += session.num
  //     count += 1
  //   })
  //   return (count === 0) ? 0 : Math.round(avg / count)
  // }

  calcAvgPace() {
    var { activityData } = this.context.runJson
    var avg = 0
    var count = 0
    activityData.forEach((session, i) => {
      session.pace.forEach((pace, j) => {
        avg += pace
        count += 1
      })
    })
    return (count === 0) ? 0 : avg / count
  }

  // calcAvgCals() {
  //   var { activityData } = this.context.runJson
  //   var avg = 0
  //   var count = 0
  //   activityData.forEach((session, idx) => {
  //     avg += session.calories
  //     count += 1
  //   })
  //   return (count === 0) ? 0 : Math.round(avg / count)
  // }

  render() {
    var { runJson } = this.context
    // var { activityIndex, pastGraphData, pastGraphLabels } = this.state
    var {
      activityIndex,
      pastGraphData,
      pastGraphLabels,
      dropdownItemClick,
      displayDate,
      nextSlide,
      previousSlide,
      calcAvgNum,
      calcAvgCals,
    } = this.props
    var currentStatDisplay = runJson.activityData[activityIndex]
//    debugger
    return (
      <div>
        <div className="row">
          <div className="col">
            <Carousel
              stats={runJson}
              previousSlide={previousSlide}
              nextSlide={nextSlide}
              activityIndex={activityIndex}
              displayDate={displayDate}
              dropdownItemClick={dropdownItemClick}
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
          {/* eventually configure the min and max of y axis */}
          <div className="col">
            <Past
              labels={pastGraphLabels}
              data={pastGraphData}
              hoverLabel="Steps"
              activity="Runs"
              yAxisMin={0}
              yAxisMax={200}
            />
          </div>
        </div>
        <div className="row mt-3">
          <div className="col-6 col-md-4">
            <div className="card text-center">
              <div className="card-body">
                <h5 className="card-title">Avg Steps per Session</h5>
                {calcAvgNum()}
              </div>
            </div>
          </div>
          <div className="col-6 col-md-4">
            <div className="card text-center">
              <div className="card-body">
                <h5 className="card-title">Avg Pace per Session</h5>
                {this.calcAvgPace()}
              </div>
            </div>
          </div>
        </div>
        <div className="row mt-3">
          <div className="col-6 col-md-4">
            <div className="card text-center">
              <div className="card-body">
                <h5 className="card-title">Avg Cals per Session</h5>
                {calcAvgCals()}
              </div>
            </div>
          </div>
          <div className="col-6 col-md-4">
            <div className="card text-center">
              <div className="card-body">
                <RunDoughnut labels={['% run', '% walk', '% rest']} data={this.makeDoughnutData()}/>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

Run.contextType = SpaContext
export default withFitnessPage(Run)
