import React, { Component } from 'react';
import LoadingScreen from "../generic/LoadingScreen"
import queryString from "query-string"
import {
  NavLink,
} from "react-router-dom";
import {
  getFromLocalStorage,
  setInLocalStorage,
  removeFromLocalStorage,
  storageKey
} from '../utils/storage';
import { makeID } from "../utils/keyGenerator"
import Error from "../messages/Error"

class Confirmation extends Component {
  constructor(props) {
    super(props)
    this.state = {
      errors: false,
      isLoading: true
    }
    this.renderDisplay = this.renderDisplay.bind(this)
  }

  componentDidMount() {
    alert("mounting")
    // get the token parameter in the URI
    var queryValues = queryString.parse(this.props.location.search)
    var emailToken = queryValues.token
    console.log(queryValues)

    const confirmUrl = `http://localhost:8080/confirmation?token=${emailToken}`
    // send request to server to verify confirmation, and add registration to database
    fetch(confirmUrl, {
      method: "GET"
    })
      .then(res => res.json())
      .then((json) => {
        console.log(json)
        if (json.success) {
          this.setState({
            isLoading: false,
          })
        } else {
          // set error message in local storage
          alert("something went wrong...")
          setInLocalStorage(storageKey + "_confirmationErr", json.messages)
          this.setState({
            errors: true,
            isLoading: false,
          })
        }
      })
    .catch((err) => {
      if (err) throw err
    })
  }

  // takes in an object of error messages and returns html elements to display them
  showError(msg, idx) {
    return (
      <Error msg={msg} key={idx}/>
    )
  }

  displayErrors() {
    var confirmationErrors = getFromLocalStorage(storageKey + "_confirmationErr")
    removeFromLocalStorage(storageKey + "_confirmationErr")
    // thoroughly check if it is empty object or not
    console.log("confirmation error should display...")
    if (confirmationErrors !== null) {
      var msgArray = Object.values(confirmationErrors)
      return msgArray.map(this.showError)
    }
  }

  renderDisplay() {
    if (this.state.isLoading) {
      return (
        <div>
          <LoadingScreen />
        </div>
      )
    } else if (!this.state.errors) {
      // no errors
      return (
        // MESSAGE SAYING YOU'RE GOOD TO GO TO LOGIN,
        // PROBABLY A NAVLINK OR SOMETHING TO LOGIN PAGE
        <div>
          <p>Registration successful! Click the link below to return to the login page.</p>
          <NavLink activeClassName="navLink" to="/">Login</NavLink>
        </div>
      )
    }
  }

  render() {
    return (
      <div>
        <div className="errors-container">
          {this.displayErrors()}
        </div>
        {this.renderDisplay()}
      </div>
    )
  }
}

export default Confirmation
