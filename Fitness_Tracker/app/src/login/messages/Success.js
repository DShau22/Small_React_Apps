import React, { Component } from 'react';

class Success extends Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: true
    }

    this.close = this.close.bind(this)
    this.display = this.display.bind(this)
  }

  close() {
    this.setState({
      visible: false
    })
  }

  display() {
    if (this.state.visible) {
      return (
        <div className="success">
          <span>{this.props.msg}</span>
          <button
            className="close-success"
            onClick={this.close}
          >
            &times;
          </button>
        </div>
      )
    }
  }

  render() {
    return (
      <div>
        {this.display()}
      </div>
    )
  }
}

export default Success
