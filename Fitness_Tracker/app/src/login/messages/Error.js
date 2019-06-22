import React, { Component } from 'react';

class Error extends Component {
  constructor(props) {
    super(props)
    this.state={
      visible: true
    }

    this.closeError = this.closeError.bind(this)
    this.display = this.display.bind(this)
  }

  closeError() {
    this.setState({
      visible: false
    })
  }

  display() {
    if (this.state.visible) {
      return (
        <div className="error">
          <span>{this.props.msg}</span>
          <button
            className="close-error"
            onClick={this.closeError}
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

export default Error
