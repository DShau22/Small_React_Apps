import ImageSlide from "./ImageSlide"
import "./Carousel.css"
import Arrow from "./Arrow"
import React from 'react'
const jumpActivity = "jump"
const runActivity = "run"
const swimActivity = "swim"

class Carousel extends React.Component {
  constructor (props) {
    super(props);
  }

  render() {
    var { stats, previousSlide, nextSlide, activityIndex } = this.props
    return (
      <div className="carousel">
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
