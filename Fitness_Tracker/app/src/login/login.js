import React, { Component } from 'react';
import 'whatwg-fetch';
import {
  getToken,
  getFromLocalStorage,
  setInLocalStorage,
  setInSessionStorage,
  storageKey
} from '../utils/storage';
import { validateSignUp } from "./loginUtils/validators"

import { Redirect } from 'react-router';

import LoadingScreen from "../generic/LoadingScreen"
import FormCard from "./FormCard"
import "./style.css"
import ErrorAlert from "../messages/Error"
import Success from "../messages/Success"

import 'react-inputs-validation/lib/react-inputs-validation.min.css';

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
      errorMsgs: new Set(),
      successMsgs: new Set(),
    };
    // init array of length 6 for signup errors
    this.signUpValid = [false, false, false, false, false, false]
    // init array of length 2 for signin errors
    this.signInValid = [false, false]

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
    this.showError = this.showError.bind(this)
    this.showSuccess = this.showSuccess.bind(this)

    this.switchToSignIn = this.switchToSignIn.bind(this)
    this.switchToSignUp = this.switchToSignUp.bind(this)

    this.clearSignUp = this.clearSignUp.bind(this)
    this.clearSignIn = this.clearSignIn.bind(this)

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

  clearSignIn() {
    this.setState({
      isLoading: false,
      signInEmail: '',
      signInPassword: '',
      remember: false,
    })
  }

  clearSignUp() {
    console.log("clearing...")
    this.setState({
      isLoading: false,
      signUpEmail: '',
      signUpPassword: '',
      signUpPasswordConf: '',
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
      console.log(json.messages)
      this.setState({
        isLoading: false,
      })
    }
  }

  // MAKE SURE TO DISALLOW WHITELISTED SPECIAL CHARACTERS
  // MAKE SURE TO VALIDATE INPUTS ON SERVER SIDE EVENTUALLY
  async onSignUp(e) {
    e.preventDefault()
    // every entry must be true for all input fields to be valid
    if (!this.signUpValid.every((bool) => bool)) {
      this.setState({ errorMsgs: ['Your form still has some errors. Please fill out all inputs or check the red outlined fields.']})
      return
    }
    this.setState({ errorMsgs: [], successMsgs: []})
    console.log("signing up...")
    var {
      signUpEmail,
      signUpPassword,
      signUpPasswordConf,
      signUpFirstName,
      signUpLastName,
      signUpUserName,
    } = this.state
    
    var validationJson = validateSignUp(this.state)
    if (!validationJson.success) {
      console.log("validation error!")
      validationJson.messages.forEach((msg, i) => {
        console.log(msg)
        this.setState(prevState => ({ errorMsgs: new Set([...prevState.errorMsgs, msg]) }))
      })
      return
    }

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
      this.setState({ successMsgs: new Set([...json.messages]) })
      this.clearSignUp()
    } else {
      var newErrors = new Set([...json.messages])
      this.setState({isLoading: false, errorMsgs: newErrors})
    }
  }

  // MAKE SURE TO DISALLOW WHITELISTED SPECIAL CHARACTERS
  // MAKE SURE TO VALIDATE INPUTS ON SERVER SIDE EVENTUALLY
  async onSignIn(e) {
    e.preventDefault()
    if (!this.signInValid.every((bool) => bool)) {
      this.setState({errorMsgs: ['Your form still has some errors. Please fill out all inputs or check the red outlined fields.']})
      return
    }
    this.setState({ errorMsgs: [], successMsgs: [] })
    // Grab state
    const {
      signInEmail,
      signInPassword,
      remember
    } = this.state;
    console.log("signing in...")
    const stored = getFromLocalStorage(storageKey)

    if (signInEmail === "test") {
      this.setState({isLoading: false})
    }

    // if there's already a token in local storage log then just login with that
    // THIS MIGHT BE BUGGY
    if (stored && stored.token) {
      alert("token already present")
      var { token } = stored
      return await this.tokenLogin(token)
    }

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
        token: json.token, // still keep the token in the state to get activity queries
        signedIn: true,
      });
      this.clearSignIn()
    } else {
      console.log(json)
      this.setState(prevState => ({
        isLoading: false,
        errorMsgs: new Set([...prevState.errorMsgs, ...json.messages])
      }))
    }
  }

  // takes in an object of error messages and returns html elements to display them
  showError(msg, idx) {
    const onClose = () => {
      this.setState(prevState => ({
        errorMsgs: new Set( [...prevState.errorMsgs].filter(errMsg => errMsg !== msg))
      }))
    }
    return ( <ErrorAlert msg={msg} key={idx} onClose={onClose}/> )
  }

  // Shows all the errors due to bad signin or signup
  displayErrors() {
    var errorMsgs = [...this.state.errorMsgs]
    return errorMsgs.map(this.showError)
  }

  //shows a signle success message
  showSuccess(msg, idx) {
    const onClose = () => {
      this.setState(prevState => ({
        successMsgs: new Set([...prevState.successMsgs].filter(successMsg => successMsg !== msg))
      }))
    }
    return ( <Success msg={msg} key={idx} onClose={onClose} /> )
  }

  // shows success messages
  showSuccesses() {
    var successMsgs = [...this.state.successMsgs]
    return successMsgs.map(this.showSuccess)
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
                signInEmail={this.state.signInEmail}
                signInPassword={this.state.signInPassword}
                
                signUpEmail={this.state.signUpEmail}
                signUpPassword={this.state.signUpPassword}
                signUpPasswordConf={this.state.signUpPasswordConf}
                signUpFirstName={this.state.signUpFirstName}
                signUpLastName={this.state.signUpLastName}
                signUpUserName={this.state.signUpUserName}

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

                signUpValid={this.signUpValid}
                signInValid={this.signInValid}
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
