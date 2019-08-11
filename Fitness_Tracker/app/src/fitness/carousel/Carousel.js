import ImageSlide from "./ImageSlide"
import "./Carousel.css"
import Arrow from "./Arrow"
import React from 'react'
import { parseDate } from "../../utils/unitConverter"
const jumpActivity = "jump"
const runActivity = "run"
const swimActivity = "swim"

class Carousel extends React.Component {
  constructor (props) {
    super(props);
    // this.dropdownItemClick = this.dropdownItemClick.bind(this)
  }
  // componentDidMount() {
  //   var { stats, activityIndex } = this.props
  //   var { uploadDate } = stats.activityData[activityIndex]
  //   var parsed = parseDate(new Date(uploadDate))
  //   var displayDate = parsed[0] + ", " + parsed[1] + " " + parsed[2]
  //   this.setState({ displayDate })
  // }

  // dropdownItemClick(e) {
  //   // on dropdown date click, display that date on the dropdown,
  //   // and switch the image slider to display that date
  //   var { updateActivityIndex } = this.props
  //   var newDate = e.target.innerText
  //   updateActivityIndex(parseInt(e.target.id))
  //   this.setState({ displayDate: newDate })
  // }

  getDropdownDates(stats) {
    var { dropdownItemClick } = this.props
    var dropdownItems = []
    stats.activityData.forEach((session, idx) => {
      var parsed = parseDate(new Date(session.uploadDate))
      var dayMonth = parsed[0] + ", " + parsed[1] + " " + parsed[2]
      dropdownItems.push(
        <span
          className="dropdown-item"
          key={"dropdown_" + idx}
          id={idx}
          onClick={dropdownItemClick}
        >
          {dayMonth}
        </span>
      )
    })
    return dropdownItems
  }

  render() {
    var { stats, previousSlide, nextSlide, activityIndex, displayDate } = this.props
    return (
      <div className="carousel">
        <div className="btn-group dropright">
          <button
            className="btn btn-secondary btn-sm mt-3 dropdown-toggle"
            type="button"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
            {displayDate()}
          </button>
          <div className="dropdown-menu">
            {this.getDropdownDates(stats)}
          </div>
        </div>

        <div className="slideShow">
          <Arrow
            direction="left"
            clickFunction={ previousSlide }
            glyph="&#8249;"
          />

          <ImageSlide stats={stats} indexDisplay={activityIndex}/>

          <Arrow
            direction="right"
            clickFunction={ nextSlide }
            glyph="&#8250;"
          />
        </div>
      </div>
    )
  }
}
export default Carousel
