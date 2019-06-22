import React, { Component } from 'react';
import 'whatwg-fetch';
import Spa from "../Spa"
import {
  getFromStorage,
  setInStorage,
  removeFromStorage,
} from '../utils/storage';
import LoadingScreen from "./LoadingScreen"
import FormCard from "./FormCard"
import "./style.css"
import Error from "./messages/Error"
import Success from "./messages/Success"

const localStorageKey = "the_main_app"

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      signedIn: false,
      token: '',
      renderSignIn: true, // specifies whether the card should show signin or signup
      signUpErrors: {},
      signInErrors: {},
      signInEmail: '',
      signInPassword: '',
      remember: false,
      signUpEmail: '',
      signUpPassword: '',
      signUpFirstName: '',
      signUpLastName: '',
      productCode: '',
      signUpSuccess: {},
    };

    this.onTextboxChangeSignInEmail = this.onTextboxChangeSignInEmail.bind(this);
    this.onTextboxChangeSignInPassword = this.onTextboxChangeSignInPassword.bind(this);
    this.onTextboxChangeSignUpEmail = this.onTextboxChangeSignUpEmail.bind(this);
    this.onTextboxChangeSignUpPassword = this.onTextboxChangeSignUpPassword.bind(this);
    this.onTextboxChangeSignUpFirstName = this.onTextboxChangeSignUpFirstName.bind(this);
    this.onTextboxChangeSignUpLastName = this.onTextboxChangeSignUpLastName.bind(this);
    this.onTextboxChangeProductCode = this.onTextboxChangeProductCode.bind(this);
    this.onCheck = this.onCheck.bind(this)
    this.displayErrors = this.displayErrors.bind(this)
    this.showSuccess = this.showSuccess.bind(this)
    this.switchToSignIn = this.switchToSignIn.bind(this)
    this.switchToSignUp = this.switchToSignUp.bind(this)

    this.clearSignUp = this.clearSignUp.bind(this)

    this.onSignIn = this.onSignIn.bind(this);
    this.onSignUp = this.onSignUp.bind(this);
    this.logout = this.logout.bind(this);

    this.handleWindowClose = this.handleWindowClose.bind(this)
  }

  // deletes token from local storage on window closing
  handleWindowClose(e) {
    e.preventDefault()
    // removes token if it is stored and user doesn't wanna be remembered
    if (!this.state.remember) {
      removeFromStorage(localStorageKey)
    }
  }

  componentDidMount() {
    console.log("mounting...")
    // get the localstorage object which may contain the _id token
    const obj = getFromStorage('the_main_app')
    // there was a token in local storage
    if (obj && obj.token) {
      const { token } = obj
      console.log("token is: ", token)

      // add the token in the headers
      var headers = new Headers()
      headers.append("authorization", `Bearer ${token}`)

      // Verify token
      fetch('http://localhost:8080/api/account/verify', {
        method: "GET",
        headers,
      })
        .catch(function(err) {throw err})
        .then(res => res.json())
        .then(json => {
          // successfully verified the token in local storage
          if (json.success) {
            this.setState({
              token,
              signedIn: true,
              isLoading: false
            })
          } else {
            console.log("verification of token went wrong")
            this.setState({
              isLoading: false,
            })
          }
        })
    } else { // there was no token in local storage
      this.setState({
        isLoading: false,
      })
    }
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

  onTextboxChangeProductCode(event) {
    this.setState({
      productCode: event.target.value,
    });
  }

  onCheck() {
    this.setState({
      remember: !this.state.remember
    })
  }

  clearSignUp() {
    this.setState({
      isLoading: false,
      signUpEmail: '',
      signUpPassword: '',
      signUpFirstName: '',
      signUpLastName: '',
      productCode: '',
    })
  }

  onSignUp() {
    // Grab state
    const {
      signUpEmail,
      signUpPassword,
      signUpFirstName,
      signUpLastName,
      productCode,
    } = this.state;
    this.setState({
      isLoading: true,
    });

    // Post request to backend
    fetch('http://localhost:8080/api/account/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: signUpEmail,
        password: signUpPassword,
        firstName: signUpFirstName,
        lastName: signUpLastName,
        productCode,
      }),
    }).then(res => res.json())
      .then(json => {
        console.log('json', json);
        if (json.success) {
          this.setState({
            signUpSuccess: json.messages,
            signInErrors: {},
            signUpErrors: {}
          })
          this.clearSignUp()
        } else {
          this.setState({
            signUpErrors: json.messages,
            isLoading: false,
          });
        }
      });
  }

  onSignIn() {
    console.log("signing in...")
    // Grab state
    const {
      signInEmail,
      signInPassword,
      remember
    } = this.state;

    this.setState({
      isLoading: true,
    });

    // Post request to backend
    fetch('http://localhost:8080/api/account/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: signInEmail,
        password: signInPassword,
        remember,
      }),
    }).then(res => res.json())
      .then(json => {
        console.log('json', json);
        if (json.success) {

          // store the token in localstorage
          // should overwrite any existing expired tokens
          setInStorage(localStorageKey, { token: json.token });

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
          this.setState({
            signInErrors: json.messages,
            isLoading: false,
          });
        }
      });
      // ADD A CATCH
  }

  logout() {
    this.setState({
      isLoading: true,
    });
    const obj = getFromStorage(localStorageKey);
    // if there is a token in localstorage
    if (obj && obj.token) {
      const { token } = obj;

      // add the token in the headers
      var headers = new Headers()
      headers.append("authorization", `Bearer ${token}`)

      // Verify token, not sure if this is really needed though for logging out
      fetch('http://localhost:8080/api/account/logout', {
        method: 'GET',
        headers,
      })
        .then(res => res.json())
        .then(json => {
          if (json.success) {
            console.log("successfully logging out...")
            removeFromStorage(localStorageKey)
            this.setState({
              token: '',
              signedIn: false,
              isLoading: false
            });
          } else {
            console.log("for some reason the token could not be verified on logout")
            // WEIRD SHIT HAPPENS HERE IDK BUT CHANGE THIS LATER
            this.setState({
              isLoading: false,
              signedIn: false,
            });
          }
        });
    } else {
      this.setState({
        isLoading: false,
        signedIn: false,
        token: ''
      });
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
    // thoroughly check if it is empty object or not
    if (Object.entries(this.state.signInErrors).length !== 0) {
      var msgArray = Object.values(this.state.signInErrors)
      return msgArray.map(this.showError)
    } else if (Object.entries(this.state.signUpErrors).length !== 0) {
      var msgArray = Object.values(this.state.signUpErrors)
      return msgArray.map(this.showError)
    }
  }

  // shows success message on successful sign up
  showSuccess() {
    var { signUpSuccess, renderSignIn } = this.state
    // there is a success message, and use is looking at the SignUp part of the card
    if (Object.entries(signUpSuccess).length !== 0 && !renderSignIn) {

      return (
        <Success msg={signUpSuccess.success} />
      )
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
    const {
      isLoading,
      token,
      signInErrors,
      signInEmail,
      signInPassword,
      signUpEmail,
      signUpPassword,
      signUpErrors,
      signUpFirstName,
      signUpLastName,
      productCode,
    } = this.state;

    if (isLoading) {
      return (<div><p>Loading...</p></div>);
    }

    if (!this.state.signedIn) {
      return (
        <div className="body">
          <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Open+Sans:600"></link>

          <div className="login-wrap">
            <div className="login-html">
              <div className="errors-container">
                {this.displayErrors()}
              </div>
              <div className="success-container">
                {this.showSuccess()}
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
                onSignUpFirstNameChange={this.onTextboxChangeSignUpFirstName}
                onSignUpLastNameChange={this.onTextboxChangeSignUpLastName}
                onSignUpProdCodeChange={this.onTextboxChangeProductCode}
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
          <div>
            <p>Account</p>
            <button onClick={this.logout}>Logout</button>
          </div>
          <div>
            <Spa removeTokenOnLogout={!this.state.remember}/>
          </div>
        </div>
      );
    }
  }
}

export default Login;
