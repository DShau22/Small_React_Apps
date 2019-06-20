import React, { Component } from 'react';
import SignIn from "./SignIn"
import SignUp from "./SignUp"

class FormCard extends Component {
  render() {
    return (
      <div className="headers">
        <input id="tab-1" type="radio" name="tab" className="sign-in" defaultChecked></input><label htmlFor="tab-1" className="tab">Sign In</label>
        <input id="tab-2" type="radio" name="tab" className="sign-up"></input><label htmlFor="tab-2" className="tab">Sign Up</label>
        <div className="login-form">
          <SignIn />
          <SignUp />
        </div>
      </div>
    )
  }
}

export default FormCard
