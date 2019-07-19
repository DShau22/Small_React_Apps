import React, { Component } from 'react';

class PwReset extends Component {
  render() {
    return (
      <form id="forget-form" onSubmit={this.props.onSubmit}>
        <div className="group">
          <label htmlFor="forgot-email" className="label">Email</label>
          <input
            id="forgot-email"
            type="text"
            className="input"
            onChange={this.props.onChange}
          >
          </input>
        </div>
        <div className="group">
          <input type="submit" className="button" value="Request Reset" id="pwResetButton" />
        </div>
      </form>
    )
  }
}

export default PwReset
