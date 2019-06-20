import React, { Component } from 'react';

class SignIn extends Component {
  render() {
    return (
      <div className="sign-in-htm">
        <div className="group">
          <label htmlFor="login-email" className="label">Email</label>
          <input id="login-email" type="text" className="input" />
        </div>
        <div className="group">
          <label htmlFor="login-pass" className="label">Password</label>
          <input id="login-pass" type="password" className="input" data-type="password" />
        </div>
        <div className="group">
          <label htmlFor="check"><span className="icon"></span> Keep me Signed in</label>
          <input id="check" type="checkbox" className="check" />
        </div>
        <div className="group">
          <input type="submit" className="button" value="Sign In" id="signInButton" onClick={console.log("click")} />
        </div>
        <div className="hr"></div>
        <div className="foot-lnk">
          <a href="#forgot">Forgot Password?</a>
        </div>
      </div>
    )
  }
}

export default SignIn
