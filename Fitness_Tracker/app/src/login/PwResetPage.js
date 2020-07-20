import React, { Component } from 'react';
import queryString from "query-string"
import {
  getFromLocalStorage,
  setInStorage,
} from '../utils/storage';

import { makeID } from "../utils/keyGenerator"
import ENDPOINTS from "../endpoints"
const confirmPwRestUrl = ENDPOINTS.passwordReset
const verifyUrl = ENDPOINTS.emailVerify

const storageKey = makeID(8)

class PwResetPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      email: '',
      newPwText: '',
      newPwTextConf: '',
    }

    this.onNewPassChange = this.onNewPassChange.bind(this)
    this.onNewPassConfChange = this.onNewPassConfChange.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
  }

  // verify that the token in the url is valid
  componentDidMount() {
    // get the token parameter in the URI
    var queryValues = queryString.parse(this.props.location.search)
    var emailToken = queryValues.token
    var headers = new Headers()
    headers.append("authorization", `Bearer ${emailToken}`)

    fetch(verifyUrl, {
      method: "GET",
      headers,
    })
      .then(body => body.json())
      .then((json) => {
        // the token from the link is invalid
        if (!json.success) {
          // var errorMsg = "Either the link has expired (12 hours) or something went wrong with the server. Please try again."
          alert("verification from the mail link went wrong")
          console.log(json);
          // SHOW THAT THERE WAS AN ERROR AND EXPLAIN WHY IN HTML
        } else {
          // setInStorage(storageKey + "_email", json.token)
          this.setState({ email: json.token.email });
        }
      })
    .catch((err) => {throw err})
  }

  onNewPassChange(e) {
    this.setState({
      newPwText: e.target.value
    })
  }

  onNewPassConfChange(e) {
    this.setState({
      newPwTextConf: e.target.value
    })
  }

  onSubmit(e) {
    e.preventDefault();
    console.log("submitted!")
    var { newPwText, newPwTextConf } = this.state
    if (newPwText !== newPwTextConf) {
      return alert("passwords must match!")
    }

    var reqBody = {
      newPassword: newPwText,
      email: this.state.email
    }
    // update the password
    fetch(confirmPwRestUrl, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(reqBody)
    })
      .then(body => body.json())
      .then((json) => {
        if (json.success) {
          alert("success")
          // display message saying password successfully reset
        } else {
          console.log(json)
          alert("something went wrong: ", json.message)
          // something went wrong
        }
      })
    .catch((err) => {throw err})
  }

  render() {
    console.log("email: ", this.state.email)
    // render a loading page if the state token is not set
    if (this.state.email.length === 0) {
      return (
        <div>Loading...</div>
      )
    }
    return (
      <div>
        <form onSubmit={this.onSubmit}>
          <div className="group">
            <label htmlFor="new-pass">enter new password</label>
            <input
              id="new-pass"
              type="password"
              className="input"
              data-type="password"
              pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
              title="Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters"
              onChange={this.onNewPassChange}
            />
          </div>
          <div className="group">
            <label htmlFor="new-pass-reap">confirm enter new password</label>
            <input
              id="new-pass-reap"
              type="password"
              className="input"
              data-type="password"
              pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
              title="Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters"
              onChange={this.onNewPassConfChange}
            />
          </div>
          <div className="group">
            <input type="submit" className="button" value="Submit" id="submitNewPassButton" />
          </div>
        </form>
      </div>
    )
  }
}

export default PwResetPage
