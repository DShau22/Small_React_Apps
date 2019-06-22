import React, { Component } from 'react';

class SignIn extends Component {
  render() {
    return (

      <div className="sign-in-htm">
        <form id="signin-form" onSubmit={this.props.onSignIn}>
          <div className="group">
            <label htmlFor="login-email" className="label">Email</label>
            <input
              id="login-email"
              type="text"
              className="input"
              onChange={this.props.onEmailChange}
            />
          </div>
          <div className="group">
            <label htmlFor="login-pass" className="label">Password</label>
            <input
              id="login-pass"
              type="password"
              className="input"
              data-type="password"
              onChange={this.props.onPwChange}
            />
          </div>
          <div className="group">
            <input id="check" type="checkbox" className="check" onClick={this.props.onCheck}/>
            <label htmlFor="check">
              <span className="icon"></span> Keep me Signed In
            </label>
          </div>
          <div className="group">
            <input type="submit" className="button" value="Sign In" id="signInButton" />
          </div>
          <div className="hr"></div>
          <div className="foot-lnk">
            <a href="#forgot">Forgot Password?</a>
          </div>
        </form>
      </div>
    )
  }
}

export default SignIn
