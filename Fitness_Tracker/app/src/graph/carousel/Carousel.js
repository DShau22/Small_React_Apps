import ImageSlide from "./ImageSlide"
import "./Carousel.css"
import Arrow from "./Arrow"
import React from 'react'
import {
  Redirect,
  NavLink,
} from "react-router-dom"

const numActivites = 3
const jumpLink = "/app/jumpDetails"
const runLink = "/app/runDetails"
const swimLink = "/app/swimDetails"
const jumpActivity = "jump"
const runActivity = "run"
const swimActivity = "swim"

class Carousel extends React.Component {
  constructor (props) {
      super(props);
      this.nextSlide = this.nextSlide.bind(this);
      this.previousSlide = this.previousSlide.bind(this);
      this.state = {
        activityIndex: 0,
        redirect: false
      };

      this.redirectLink = this.redirectLink.bind(this)
      this.renderRedirect = this.renderRedirect.bind(this)
      this.setRedirect = this.setRedirect.bind(this)
    }

  previousSlide () {
    var nextIndex = (this.state.activityIndex + numActivites - 1) % numActivites

    this.setState({
      activityIndex: nextIndex
    });
  }

  nextSlide () {
    var nextIndex = (this.state.activityIndex + 1) % numActivites
    this.setState({
      activityIndex: nextIndex
    })
  }

  redirectLink() {
    var activity = this.props.activities[this.state.activityIndex]
    if (activity.action === jumpActivity) return jumpLink
    if (activity.action === runActivity) return runLink
    if (activity.action === swimActivity) return swimLink
  }

  setRedirect () {
    this.setState({
      redirect: true
    })
  }

  renderRedirect () {
    if (this.state.redirect) return <Redirect to={this.redirectLink()} />
  }

  render () {
    return (
      <div className="carousel">
        <div className="slideShow">
          <Arrow
            direction="left"
            clickFunction={ this.previousSlide }
            glyph="&#9664;" />

          <ImageSlide activity={this.props.activities[this.state.activityIndex]} />

          <Arrow
            direction="right"
            clickFunction={ this.nextSlide }
            glyph="&#9654;" />
        </div>
        <div>
          <NavLink
            className="routeButton"
            id="details"
            to={this.redirectLink()}
          >
            details
          </NavLink>
        </div>
      </div>
    )
  }
}
export default Carousel
