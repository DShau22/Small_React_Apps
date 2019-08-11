import React, {Component} from 'react'
import SpaContext from "../Context"
import { parseDate } from "../utils/unitConverter"

// HOC for run, swim, jump fitness pages.
// reuses label and data getting for:
// 1. past laps/jumps/steps (num)
// 2. Carousel display
// 3. Cals and duration circles
// 4. details link button
// 5. pace/jump/time (swim) progressions (swim still adds laps of each stroke done)
// 6. average jumps/steps/laps (num)
// 7. percentToGoal ? 
export default function withFitnessPage( WrappedComponent ) {  
  class WithFitnessPage extends Component {
    constructor(props) {
      super(props)
    
      this.state = {
        activityIndex: 0,
        pastGraphLabels: [],
        pastGraphData: [],
        progressionLabels: [],
        progressionDate: [], 
      }
      this.nextSlide = this.nextSlide.bind(this);
      this.previousSlide = this.previousSlide.bind(this);
      this.makePastGraphLabels = this.makePastGraphLabels.bind(this)
      this.makePastGraphData = this.makePastGraphData.bind(this)
      this.dropdownItemClick = this.dropdownItemClick.bind(this)
      this.displayDate = this.displayDate.bind(this)
      this.calcAvgNum = this.calcAvgNum.bind(this)
      this.calcAvgCals = this.calcAvgCals.bind(this)
    }

    componentDidMount() {
      console.log('mounted')
      this.makePastGraphLabels()
      this.makePastGraphData()
    }

    // gets the labels for the graph that displays num field over past upload dates
    makePastGraphLabels() {
      var pastGraphLabels = []
      this.context.runJson.activityData.forEach((session, idx) => {
        var { uploadDate } = session
        var stringToDate = new Date(uploadDate)
        // this is an array
        var dateInfo = parseDate(stringToDate)
        pastGraphLabels.push(dateInfo[0] + ", " + dateInfo[1] + " " + dateInfo[2])
      })
      this.setState({ pastGraphLabels })
    }

    makePastGraphData() {
      var pastGraphData = []
      this.context.runJson.activityData.forEach((session, idx) => {
        var { num } = session
        pastGraphData.push(num)
      })
      this.setState({ pastGraphData })
      //debugger
    }

    // returns Day of week, month day (num) in a string format
    // i.e Sat, Jul 20
    displayDate() {
      var { runJson } = this.context
      var { activityIndex } = this.state
      var { uploadDate } = runJson.activityData[activityIndex]
      var parsed = parseDate(new Date(uploadDate))
      var date = parsed[0] + ", " + parsed[1] + " " + parsed[2]
      return date
    }

    dropdownItemClick(e) {
      // on dropdown date click, display that date on the dropdown,
      // and switch the image slider to display that date
      this.setState({ activityIndex: parseInt(e.target.id) })
    }

    calcAvgNum() {
      var { activityData } = this.context.runJson
      var avg = 0
      var count = 0
      activityData.forEach((session, idx) => {
        avg += session.num
        count += 1
      })
      return (count === 0) ? 0 : Math.round(avg / count)
    }

    calcAvgCals() {
      var { activityData } = this.context.runJson
      var avg = 0
      var count = 0
      activityData.forEach((session, idx) => {
        avg += session.calories
        count += 1
      })
      return (count === 0) ? 0 : Math.round(avg / count)
    }

    previousSlide() {
      //debugger
      var { activityData } = this.context.runJson
      var nextIndex = Math.min((this.state.activityIndex + 1), activityData.length - 1)
      this.setState({ activityIndex: nextIndex })
    }
  
    nextSlide() {
      // 0 represents the most recent upload date
      var nextIndex = Math.max((this.state.activityIndex - 1), 0)
      this.setState({ activityIndex: nextIndex })
    }

    render() {
      var { runJson } = this.context
      var { activityIndex, pastGraphData, pastGraphLabels } = this.state
      var currentStatDisplay = runJson.activityData[activityIndex]
      return (
        <div>
          <WrappedComponent
            pastGraphData={pastGraphData}
            pastGraphLabels={pastGraphLabels}
            activityIndex={activityIndex}
            dropdownItemClick={this.dropdownItemClick}
            displayDate={this.displayDate}
            nextSlide={this.nextSlide}
            previousSlide={this.previousSlide}
            calcAvgNum={this.calcAvgNum}
            calcAvgCals={this.calcAvgCals}
            {...this.props}
          />
        </div>
      )
    }
  }
  WithFitnessPage.contextType = SpaContext
  
  return WithFitnessPage
}

