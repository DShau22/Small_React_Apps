import React, { Component } from 'react';
import SignIn from "./SignIn"
import SignUp from "./SignUp"

class FormCard extends Component {
  render() {
    return (
      <div className="headers">
        <input
          id="tab-1"
          type="radio"
          name="tab"
          className="sign-in"
          checked={this.props.renderSignIn}
          onChange={this.props.onSignInClick}
        >
        </input>
        <label htmlFor="tab-1" className="tab">Sign In</label>
        <input
          id="tab-2"
          type="radio"
          name="tab"
          className="sign-up"
          checked={!this.props.renderSignIn}
          onChange={this.props.onSignUpClick}
        >
        </input><label htmlFor="tab-2" className="tab">Sign Up</label>
        <div className="login-form">
          <SignIn
            signInEmail={this.props.signInEmail}
            signInPassword={this.props.signInPassword}

            onEmailChange={this.props.onSignInEmailChange}
            onPwChange={this.props.onSignInPwChange}
            onSignIn={this.props.handleSignIn}
            onCheck={this.props.onCheck}
          />
          <SignUp
            signUpEmail={this.props.signUpEmail}
            signUpPassword={this.props.signUpPassword}
            signUpPasswordConf={this.props.signUpPasswordConf}
            signUpFirstName={this.props.signUpFirstName}
            signUpLastName={this.props.signUpLastName}
            signUpUserName={this.props.signUpUserName}

            onEmailChange={this.props.onSignUpEmailChange}
            onPwChange={this.props.onSignUpPwChange}
            onPwConfChange={this.props.onSignUpPwChangeConf}
            onFirstNameChange={this.props.onSignUpFirstNameChange}
            onLastNameChange={this.props.onSignUpLastNameChange}
            onSignUpUserNameChange={this.props.onSignUpUserNameChange}
            onSubmit={this.props.handleSignUp}
            switchToSignIn={this.props.onSignInClick}
          />
        </div>
      </div>
    )
  }
}

export default FormCard
