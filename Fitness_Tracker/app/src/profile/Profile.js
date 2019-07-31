import React, { Component } from 'react';
import {
  withRouter
} from "react-router-dom";
import UserProfile from "./UserProfile"
import SearchProfile from "./SearchProfile"

class Profile extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    var { context } = this.props
    var { username } = this.props.match.params
    // debugger;
    if (username === context.username) {
      // this is the same user who is looking at their own profile
      return ( <UserProfile context={context}/> )
    }
    return ( <SearchProfile context={context} /> )
  }
}

const protoStyle = {
  "border": "solid",
  "marginTop": "10px"
}

export default withRouter(Profile)
