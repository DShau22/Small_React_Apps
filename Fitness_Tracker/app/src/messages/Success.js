import React, { Component } from 'react';

class Success extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className="alert alert-success alert-dismissible">
        <a href="#" className="close" data-dismiss="alert" aria-label="close">&times;</a>
        <span>{this.props.msg}</span>
      </div>
    )
  }
}

export default Success
