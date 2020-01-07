import React, { Component } from 'react';

class SignUp extends Component {

  render() {
    return (
      <div className="sign-up-htm">
        <form id="signup-form" onSubmit={this.props.onSubmit}>
          <div className="group mt-3">
            <label htmlFor="signup-email" className="label">Email Address</label>
            <input
              id="signup-email"
              type="text"
              name="email"
              className="input"
              pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
              title="Must be a valid email address"
              onChange={this.props.onEmailChange}
            ></input>
          </div>
          <div className="group">
            <label htmlFor="signup-pass" className="label">Password</label>
            <input
              id="signup-pass"
              type="password"
              name="password"
              className="input"
              data-type="password"
              pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
              title="Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters"
              onChange={this.props.onPwChange}
            ></input>
          </div>
          <div className="group">
            <label htmlFor="reap-pass" className="label">Repeat Password</label>
            <input
              id="reap-pass"
              type="password"
              className="input"
              data-type="password"
              pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
              title="Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters"
              onChange={this.props.onPwConfChange}
            ></input>
          </div>
          <div className="group">
            <label htmlFor="prod-code" className="label">Product Code</label>
            <input
              id="prod-code"
              type="text"
              name="productCode"
              className="input"
              onChange={this.props.onProdCodeChange}
            />
          </div>
          <div className="group">
            <label htmlFor="first-name" className="label">First Name</label>
            <input
              id="first-name"
              type="text"
              name="firstName"
              className="input"
              onChange={this.props.onFirstNameChange}
            />
          </div>
          <div className="group">
            <label htmlFor="last-name" className="label">Last Name</label>
            <input
              id="last-name"
              type="text"
              name="lastName"
              className="input"
              onChange={this.props.onLastNameChange}
            />
          </div>
          <div className="group">
            <input
              type="submit"
              className="button"
              value="Sign Up"
              id="signUpButton"
            />
          </div>
          <div className="hr"></div>
          <div className="foot-lnk">
            <label htmlFor="tab-1"> Already a Member? </label>
          </div>
        </form>
      </div>
    )
  }
}

export default SignUp
