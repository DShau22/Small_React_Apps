import React, { Component } from 'react';
import 'whatwg-fetch';
import Spa from "../Spa"
import {
  getToken,
  getFromLocalStorage,
  setInLocalStorage,
  removeFromLocalStorage,
  setInSessionStorage,
  storageKey
} from '../utils/storage';

import { makeID } from "../utils/keyGenerator"

import { Redirect } from 'react-router';

import LoadingScreen from "./LoadingScreen"
import FormCard from "./FormCard"
import "./style.css"
import Error from "./messages/Error"
import Success from "./messages/Success"

const verifyURL = "http://localhost:8080/api/account/verify"
const signUpURL = "http://localhost:8080/api/account/signup"
const signInURL = 'http://localhost:8080/api/account/signin'

// stores token in localstorage if user clicked remember me
// else stores it in session storage
function storeToken(remember, token) {
  if (remember) {
    setInLocalStorage(storageKey, { token })
  } else {
    setInSessionStorage(storageKey, { token })
  }
}

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      signedIn: false,
      token: '',
      renderSignIn: true, // specifies whether the card should show signin or signup
      signInEmail: '',
      signInPassword: '',
      remember: false,
      signUpEmail: '',
      signUpPassword: '',
      signUpPasswordConf: '',
      signUpFirstName: '',
      signUpLastName: '',
      signUpUserName: '',
    };

    this.onTextboxChangeSignInEmail = this.onTextboxChangeSignInEmail.bind(this);
    this.onTextboxChangeSignInPassword = this.onTextboxChangeSignInPassword.bind(this);
    this.onTextboxChangeSignUpEmail = this.onTextboxChangeSignUpEmail.bind(this);
    this.onTextboxChangeSignUpPassword = this.onTextboxChangeSignUpPassword.bind(this);
    this.onTextboxChangeSignUpPasswordConf = this.onTextboxChangeSignUpPasswordConf.bind(this);
    this.onTextboxChangeSignUpFirstName = this.onTextboxChangeSignUpFirstName.bind(this);
    this.onTextboxChangeSignUpLastName = this.onTextboxChangeSignUpLastName.bind(this);
    this.onTextboxChangeSignUpUsername = this.onTextboxChangeSignUpUsername.bind(this);
    this.onCheck = this.onCheck.bind(this)
    this.displayErrors = this.displayErrors.bind(this)
    this.showSuccesses = this.showSuccesses.bind(this)
    this.switchToSignIn = this.switchToSignIn.bind(this)
    this.switchToSignUp = this.switchToSignUp.bind(this)

    this.clearSignUp = this.clearSignUp.bind(this)

    this.onSignIn = this.onSignIn.bind(this);
    this.onSignUp = this.onSignUp.bind(this)
    this.tokenLogin = this.tokenLogin.bind(this)
  }

  componentDidMount() {
    console.log("mounting...")
    // get the localstorage object which may contain the _id token
    const obj = getFromLocalStorage(storageKey)
    // there was a token in local storage
    if (obj && obj.token) {
      try {
        this.tokenLogin(obj.token)
      } catch(err) {
        throw err
      }
    } else { // there was no token in local storage
      this.setState({
        isLoading: false,
      })
    }
  }

  onTextboxChangeSignUpPasswordConf(event) {
    this.setState({
      signUpPasswordConf: event.target.value
    })
  }
  onTextboxChangeSignInEmail(event) {
    this.setState({
      signInEmail: event.target.value,
    });
  }
  onTextboxChangeSignInPassword(event) {
    this.setState({
      signInPassword: event.target.value,
    });
  }
  onTextboxChangeSignUpEmail(event) {
    this.setState({
      signUpEmail: event.target.value,
    });
  }
  onTextboxChangeSignUpPassword(event) {
    this.setState({
      signUpPassword: event.target.value,
    });
  }
  onTextboxChangeSignUpFirstName(event) {
    this.setState({
      signUpFirstName: event.target.value,
    });
  }
  onTextboxChangeSignUpLastName(event) {
    this.setState({
      signUpLastName: event.target.value,
    });
  }
  onTextboxChangeSignUpUsername(event) {
    this.setState({
      signUpUserName: event.target.value,
    });
  }
  onCheck() {
    this.setState({
      remember: !this.state.remember
    })
  }
  clearSignUp() {
    console.log("clearing...")
    this.setState({
      isLoading: false,
      signUpEmail: '',
      signUpPassword: '',
      signUpFirstName: '',
      signUpLastName: '',
      signUpUserName: '',
    })
  }

  // MAKE SURE TO DISALLOW WHITELISTED SPECIAL CHARACTERS
  // MAKE SURE TO VALIDATE INPUTS ON SERVER SIDE EVENTUALLY
  // checks if there is a token in localstorage for login
  async tokenLogin(token) {
    console.log("token is: ", token)

    // add the token in the headers
    var headers = new Headers()
    headers.append("authorization", `Bearer ${token}`)

    // Verify token
    var res = await fetch(verifyURL, {
      method: "GET",
      headers,
    })
    var json = await res.json()
    if (json.success) {
      this.setState({
        token,
        signedIn: true,
        isLoading: false
      })
    } else {
      console.log("verification of token went wrong")
      console.log(json.message)
      this.setState({
        isLoading: false,
      })
    }
  }

  // MAKE SURE TO DISALLOW WHITELISTED SPECIAL CHARACTERS
  // MAKE SURE TO VALIDATE INPUTS ON SERVER SIDE EVENTUALLY
  async onSignUp() {
    console.log("signing up...")
    var {
      signUpEmail,
      signUpPassword,
      signUpPasswordConf,
      signUpFirstName,
      signUpLastName,
      signUpUserName,
    } = this.state
    
    this.setState({
      isLoading: true,
    });

    // Post request to backend
    var res = await fetch(signUpURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        password: signUpPassword,
        passwordConf: signUpPasswordConf,
        email: signUpEmail,
        firstName: signUpFirstName,
        lastName: signUpLastName,
        username: signUpUserName
      }),
    })
    var json = await res.json()
    console.log('json', json);
    if (json.success) {
      this.clearSignUp()
    } else {
      setInLocalStorage(storageKey + "_signUpErrors", json.messages)
      this.setState({
        isLoading: false,
      })
    }
  }

  // MAKE SURE TO DISALLOW WHITELISTED SPECIAL CHARACTERS
  // MAKE SURE TO VALIDATE INPUTS ON SERVER SIDE EVENTUALLY
  async onSignIn() {
    // Grab state
    const {
      signInEmail,
      signInPassword,
      remember
    } = this.state;
    console.log("signing in...")
    const stored = getFromLocalStorage(storageKey)

    // if there's already a token in local storage log then just login with that
    if (stored && stored.token) {
      alert("token already present")
      var { token } = stored
      return await this.tokenLogin(token)
    }
    alert("token not present")

    this.setState({
      isLoading: true,
    });

    // Post request to backend
    var res = await fetch(signInURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: signInEmail,
        password: signInPassword,
        remember,
      }),
    })
    var json = await res.json()
    console.log('json', json);
    if (json.success) {
      // store the token in localstorage
      // should overwrite any existing expired tokens
      storeToken(remember, json.token);

      this.setState({
        isLoading: false,
        signInPassword: '',
        signInEmail: '',
        signUpErrors: {},
        signInErrors: {},
        token: json.token, // still keep the token in the state to get activity queries
        signedIn: true,
      });
    } else {
      setInLocalStorage(storageKey + "_signInErrors", json.messages)
      this.setState({
        // signInErrors: json.messages,
        isLoading: false,
      })
    }
  }

  // takes in an object of error messages and returns html elements to display them
  showError(msg, idx) {
    return (
      <Error msg={msg} key={idx}/>
    )
  }

  // Shows all the errors due to bad signin or signup
  displayErrors() {
    var { renderSignIn } = this.state
    // returns null if not in local storage, otherwise gets error messages
    var signInErrors = getFromLocalStorage(storageKey + "_signInErrors")
    var signUpErrors = getFromLocalStorage(storageKey + "_signUpErrors")
    var pwResetErrors = getFromLocalStorage(storageKey + "_pwResetEmailErr")
    // clear the errors so they don't show up again
    removeFromLocalStorage(storageKey + "_signInErrors")
    removeFromLocalStorage(storageKey + "_signUpErrors")
    removeFromLocalStorage(storageKey + "_pwResetEmailErr")
    // thoroughly check if it is empty object or not
    var msgArray;
    if (signInErrors !== null && renderSignIn) {
      msgArray = Object.values(signInErrors)
      return msgArray.map(this.showError)
    } else if (signUpErrors !== null && !renderSignIn) {
      msgArray = Object.values(signUpErrors)
      return msgArray.map(this.showError)
    } else if (pwResetErrors !== null && renderSignIn) {
      msgArray = Object.values(pwResetErrors)
      return msgArray.map(this.showError)
    }
  }

  //shows a signle success message
  showSuccess(msg, idx) {
    return (
      <Success msg={msg} key={idx} />
    )
  }

  // shows success messages
  showSuccesses() {
    var { renderSignIn } = this.state
    // returns null if not in local storage, otherwise gets error messages
    var signUpSuccess = getFromLocalStorage(storageKey + "_signUpSuccess")
    var pwResetSuccess = getFromLocalStorage(storageKey + "_pwResetEmailMsg")
    // clear from storage so it doesn't show up again
    removeFromLocalStorage(storageKey + "_signUpSuccess")
    removeFromLocalStorage(storageKey + "_pwResetEmailMsg")
    // there is a success message, and use is looking at the SignUp part of the card
    var successArray;
    if (signUpSuccess !== null && !renderSignIn) {
      successArray = Object.values(signUpSuccess)
      return successArray.map(this.showSuccess)
    } else if (pwResetSuccess !== null && renderSignIn) {
      successArray = Object.values(pwResetSuccess)
      return successArray.map(this.showSuccess)
    }
  }

  //switches from signup to signin on the card
  switchToSignIn() {
    this.setState({
      renderSignIn: true
    })
  }

  //switches from signin to signup on the card
  switchToSignUp() {
    this.setState({
      renderSignIn: false
    })
  }

  render() {
    console.log("rendering login")
    const {
      isLoading,
    } = this.state;

    if (isLoading) {
      return (<div><p>Loading...</p></div>);
    }

    if (!getToken()) {
      return (
        <div className="body">
          <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Open+Sans:600"></link>

          <div className="login-wrap">
            <div className="login-html">
              <div className="errors-container">
                {this.displayErrors()}
              </div>
              <div className="success-container">
                {this.showSuccesses()}
              </div>
              <LoadingScreen />
              <FormCard
                renderSignIn={this.state.renderSignIn}
                onSignInClick={this.switchToSignIn}
                onSignUpClick={this.switchToSignUp}
                onSignInEmailChange={this.onTextboxChangeSignInEmail}
                onSignInPwChange={this.onTextboxChangeSignInPassword}
                onCheck={this.onCheck}
                handleSignIn={this.onSignIn}
                onSignUpEmailChange={this.onTextboxChangeSignUpEmail}
                onSignUpPwChange={this.onTextboxChangeSignUpPassword}
                onSignUpPwChangeConf={this.onTextboxChangeSignUpPasswordConf}
                onSignUpFirstNameChange={this.onTextboxChangeSignUpFirstName}
                onSignUpLastNameChange={this.onTextboxChangeSignUpLastName}
                onSignUpUserNameChange={this.onTextboxChangeSignUpUsername}
                handleSignUp={this.onSignUp}
              />
            </div>
          </div>
        </div>
      );
    } else {
      // token is in the state and user has logged in!
      return (
        <div>
          <Redirect
            to={{
              pathname: "/app",
              state: { token: this.state.token }
            }}
          />
        </div>
      );
    }
  }
}

export default Login;
