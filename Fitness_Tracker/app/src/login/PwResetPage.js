import React, { Component } from 'react';
import queryString from "query-string";
import ClipLoader from "react-spinners/ClipLoader";
import ENDPOINTS from "../endpoints";
const confirmPwRestUrl = ENDPOINTS.passwordReset;
const verifyUrl = ENDPOINTS.emailVerify;

class PwResetPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      email: '',
      newPwText: '',
      newPwTextConf: '',
      error: null,
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
        console.log(json);
        // the token from the link is invalid
        if (!json.success) {
          // var errorMsg = "Either the link has expired (12 hours) or something went wrong with the server. Please try again."
          this.setState({ error: json.messages[0] });
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
      return alert("passwords must match!");
    }
    if (newPwText.length < 8) {
      return alert("passwords must have more than 8 characters!");
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
          alert("something went wrong: ", json.messages[0])
          // something went wrong
        }
      })
    .catch((err) => {throw err});
  }

  render() {
    console.log("email: ", this.state.email);
    // render a loading page if the state token is not set
    if (this.state.error) {
      return (
        <div className='pwReset-page'>
          <div className='card m-5'>
            <h5 className="card-header conf-header-error">Oh no :(</h5>
            <div className="card-body text-center errors-container">
              <span>
                Something went wrong with the password reset process. Please refresh
                and try again: {this.state.error}.
              </span>
            </div>
          </div>
        </div>
      )
    } else if (this.state.email.length === 0) {
      return (
        <div className='loading-container'>
          <ClipLoader color={'#404E7C'} loading={this.state.isLoading} size={90}/>
        </div>
      )
    }
    return (
      <div className="pwReset-page">
        <div className='card'>
          <div class="card-header text-white">
            Reset Your Athlos Live Password
          </div>
          <div className='card-body'>
            <form onSubmit={this.onSubmit}>
              <div className="form-group">
                <label htmlFor="new-pass">Enter new password</label>
                <input
                  id="new-pass"
                  type="password"
                  className="form-control"
                  data-type="password"
                  pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[!@#$%^&*-=.A-Za-z\d]{8,}$"
                  title="Must contain 8 characters, one uppercase, one lowercase, one number. Only !@#$%^&*-=. special characters allowed."
                  onChange={this.onNewPassChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="new-pass-reap">Confirm new password</label>
                <input
                  id="new-pass-reap"
                  type="password"
                  className="form-control"
                  data-type="password"
                  pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[!@#$%^&*-=.A-Za-z\d]{8,}$"
                  title="Must contain 8 characters, one uppercase, one lowercase, one number. Only !@#$%^&*-=. special characters allowed."
                  onChange={this.onNewPassConfChange}
                />
              </div>
              <div className="form-group">
                <input type="submit" className="btn btn-outline-info" value="Submit" id="submitNewPassButton" />
              </div>
            </form>
          </div>
        </div>
      </div>

    )
  }
}

export default PwResetPage
