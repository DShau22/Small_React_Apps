import React, { Component } from 'react';

class Error extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className="alert alert-danger alert-dismissible">
        <a href="#" className="close" data-dismiss="alert" aria-label="close">&times;</a>
        <span>{this.props.msg}</span>
      </div>
    )
  }
}

export default Error
