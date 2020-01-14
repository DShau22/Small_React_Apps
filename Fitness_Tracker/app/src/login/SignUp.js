import React, { Component } from 'react';
// const regexWhitelist = '^[a-zA-Z0-9]'
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
              pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
              title="Must be a valid email address"
              onChange={this.props.onEmailChange}
              value={this.props.signUpEmail}
              required
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
              pattern="(?=[-\w+_!@#$%^&*.,?]*\d)(?=[-\w+_!@#$%^&*.,?]*[a-z])(?=[-\w+_!@#$%^&*.,?]*[A-Z])[-\w+_!@#$%^&*.,?]{8,}"
              title="Must contain at least one number, one uppercase and one lowercase letter. Must be 8+ characters long."
              maxLength='30'
              onChange={this.props.onPwChange}
              value={this.props.signUpPassword}
              required
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
              title="Must contain at least one number, one uppercase and one lowercase letter. Must be 8+ characters long."
              onChange={this.props.onPwConfChange}
              value={this.props.signUpPasswordConf}
              maxLength='30'
              required
            ></input>
          </div>
          <div className="group">
            <label htmlFor="prod-code" className="label">Username</label>
            <input
              id="prod-code"
              type="text"
              name="productCode"
              className="input"
              onChange={this.props.onSignUpUserNameChange}
              maxLength='30'
              minLength='1'
              pattern="[a-zA-Z0-9]+"
              title="Must only contain alphanumeric characters"
              value={this.props.signUpUserName}
              required
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
              maxLength='30'
              pattern="[a-zA-Z0-9]+"
              title="Must only contain alphanumeric characters and no spaces"
              value={this.props.signUpFirstName}
              required
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
              maxLength='40'
              pattern="[a-zA-Z0-9]+"
              title="Must only contain alphanumeric characters"
              value={this.props.signUpLastName}
              required
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
            <label id='already-member' htmlFor="tab-1"> Already a Member? </label>
          </div>
        </form>
      </div>
    )
  }
}

export default SignUp
