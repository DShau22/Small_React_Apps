import React, { Component } from 'react';
import 'whatwg-fetch';
import Spa from "../Spa"
import {
  getFromStorage,
  setInStorage,
  removeFromStorage,
} from '../utils/storage';
import Errors from "./messages/Errors"
import Successes from "./messages/Successes"
import LoadingScreen from "./LoadingScreen"
import FormCard from "./FormCard"
import "./style.css"

const localStorageKey = "the_main_app"

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      token: '',
      signUpError: '',
      signInError: '',
      signInEmail: '',
      signInPassword: '',
      signUpEmail: '',
      signUpPassword: '',
      signUpFirstName: '',
      signUpLastName: '',
      productCode: '',
    };

    this.onTextboxChangeSignInEmail = this.onTextboxChangeSignInEmail.bind(this);
    this.onTextboxChangeSignInPassword = this.onTextboxChangeSignInPassword.bind(this);
    this.onTextboxChangeSignUpEmail = this.onTextboxChangeSignUpEmail.bind(this);
    this.onTextboxChangeSignUpPassword = this.onTextboxChangeSignUpPassword.bind(this);
    this.onTextboxChangeSignUpFirstName = this.onTextboxChangeSignUpFirstName.bind(this);
    this.onTextboxChangeSignUpLastName = this.onTextboxChangeSignUpLastName.bind(this);
    this.onTextboxChangeProductCode = this.onTextboxChangeProductCode.bind(this);

    this.clearSignUp = this.clearSignUp.bind(this)

    this.onSignIn = this.onSignIn.bind(this);
    this.onSignUp = this.onSignUp.bind(this);
    this.logout = this.logout.bind(this);
  }

  componentDidMount() {
    console.log("mounting...")

    // get the localstorage object which may contain the _id token
    const obj = getFromStorage('the_main_app')
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
          if (json.success) {
            this.setState({
              token,
              isLoading: false
            })
          } else {
            this.setState({
              isLoading: false,
            })
          }
        })
    } else {
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
            signUpError: json.message,
          })
          this.clearSignUp()
        } else {
          this.setState({
            signUpError: json.message,
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
        remember: true,
      }),
    }).then(res => res.json())
      .then(json => {
        console.log('json', json);
        if (json.success) {
          // stores the token in localstorage
          setInStorage(localStorageKey, { token: json.token });

          this.setState({
            signInError: json.message,
            isLoading: false,
            signInPassword: '',
            signInEmail: '',
            token: json.token,
          });
        } else {
          this.setState({
            signInError: json.message,
            isLoading: false,
          });
        }
      });
  }

  logout() {
    this.setState({
      isLoading: true,
    });
    const obj = getFromStorage(localStorageKey);
    if (obj && obj.token) {
      const { token } = obj;

      // add the token in the headers
      var headers = new Headers()
      headers.append("authorization", `Bearer ${token}`)

      // Verify token
      fetch('http://localhost:8080/api/account/logout', {
        method: 'GET',
        headers,
      })
        .then(res => res.json())
        .then(json => {
          if (json.success) {
            removeFromStorage(localStorageKey)
            this.setState({
              token: '',
              isLoading: false
            });
          } else {
            this.setState({
              isLoading: false,
            });
          }
        });
    } else {
      this.setState({
        isLoading: false,
      });
    }
  }

  render() {
    const {
      isLoading,
      token,
      signInError,
      signInEmail,
      signInPassword,
      signUpEmail,
      signUpPassword,
      signUpError,
      signUpFirstName,
      signUpLastName,
      productCode,
    } = this.state;

    if (isLoading) {
      return (<div><p>Loading...</p></div>);
    }

    if (!token) {
      return (
        <div className="body">
          <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Open+Sans:600"></link>

          <div className="login-wrap">
            <div className="login-html">
              <Errors props={{
                containerVisible: false,
                closeEmailExistsVisible: false,
                closeInvalidPasswordVisible: false,
                closePasswordsMustMatchVisible: false,
              }}
              />
              <Successes props={{
                containerVisible: false,
                successVisible: false,
              }}
              />
              <LoadingScreen />
              <FormCard />
            </div>
          </div>
        </div>
      //   <div>
      //     <div>
      //       {
      //         (signInError) ? (
      //           <p>{signInError}</p>
      //         ) : (null)
      //       }
      //       <p>Sign In</p>
      //       <input
      //         type="email"
      //         placeholder="Email"
      //         value={signInEmail}
      //         onChange={this.onTextboxChangeSignInEmail}
      //       />
      //       <br />
      //       <input
      //         type="password"
      //         placeholder="Password"
      //         value={signInPassword}
      //         onChange={this.onTextboxChangeSignInPassword}
      //       />
      //       <br />
      //       <button onClick={this.onSignIn}>Sign In</button>
      //     </div>
      //     <br />
      //     <br />
      //     <div>
      //       {
      //         (signUpError) ? (
      //           <p>{signUpError}</p>
      //         ) : (null)
      //       }
      //       <p>Sign Up</p>
      //       <input
      //         type="email"
      //         placeholder="Email"
      //         value={signUpEmail}
      //         onChange={this.onTextboxChangeSignUpEmail}
      //       /><br />
      //       <input
      //         type="password"
      //         placeholder="Password"
      //         value={signUpPassword}
      //         onChange={this.onTextboxChangeSignUpPassword}
      //       /><br />
      //       <input
      //         type="text"
      //         placeholder="First Name"
      //         value={signUpFirstName}
      //         onChange={this.onTextboxChangeSignUpFirstName}
      //       /><br />
      //       <input
      //         type="text"
      //         placeholder="Last Name"
      //         value={signUpLastName}
      //         onChange={this.onTextboxChangeSignUpLastName}
      //       /><br />
      //       <input
      //         type="text"
      //         placeholder="Product Code"
      //         value={productCode}
      //         onChange={this.onTextboxChangeProductCode}
      //       /><br />
      //       <button onClick={this.onSignUp}>Sign Up</button>
      //       <button onClick={this.clearSignUp}>Clear</button>
      //     </div>
      //
      //   </div>
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
            <Spa />
          </div>
        </div>
      );
    }
  }
}

export default Login;
