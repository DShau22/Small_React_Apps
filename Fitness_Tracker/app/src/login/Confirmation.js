import React, { Component } from 'react';
import ClipLoader from "react-spinners/ClipLoader";
import queryString from "query-string"
import {
  withRouter
} from "react-router-dom";
import {
  getFromLocalStorage,
  removeFromLocalStorage,
  setInLocalStorage,
  storageKey
} from '../utils/storage';
import Error from "../messages/Error"
import "./style.css"
import ENDPOINTS from "../endpoints"

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
    // get the token parameter in the URI
    var queryValues = queryString.parse(this.props.location.search);
    var emailToken = queryValues.token;
    console.log(queryValues);

    const confirmUrl = `${ENDPOINTS.confirm}?token=${emailToken}`;
    // send request to server to verify confirmation, and add registration to database
    fetch(confirmUrl, {
      method: "GET"
    })
      .then(res => res.json())
      .then(json => {
        console.log(json)
        if (json.success) {
          this.setState({
            isLoading: false,
          })
        } else {
          // set error message in local storage
          setInLocalStorage(storageKey + "_confirmationErr", json.messages)
          this.setState({
            errors: true,
            isLoading: false,
          })
        }
      })
    .catch((err) => {
      if (err) throw err
    });
  }

  // takes in an object of error messages and returns html elements to display them
  showError(msg, idx) {
    return (
      <Error msg={msg} key={idx} onClose={() => {}}/>
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
      return <div></div>
    } else if (!this.state.errors) {
      // no errors
      return (
        // MESSAGE SAYING YOU'RE GOOD TO GO TO LOGIN,
        // PROBABLY A NAVLINK OR SOMETHING TO LOGIN PAGE
        <React.Fragment>
          <h5 className="card-header conf-header">You're All Set!</h5>
          <div className='card-body text-center'>
            <p>
              Your registration was successful! You can now log in with the Athlos Live app :)
            </p>
          </div>
        </React.Fragment>
      )
    } else {
      return (
        <React.Fragment>
          <h5 className="card-header conf-header-error">Oh no :(</h5>
          <div className="card-body text-center errors-container">
            {this.displayErrors()}
          </div>
        </React.Fragment>
      )
    }
  }

  render() {
    if (this.state.isLoading) {
      return (
        <div className='loading-container'>
          <ClipLoader color={'#404E7C'} loading={this.state.isLoading} size={90}/>
        </div>
      )
    } else {
      return (
        <div className='conf-page'>
          <div className='card m-5'>
            {this.renderDisplay()}              
          </div>
        </div>
      )
    }
  }
}

export default withRouter(Confirmation)
