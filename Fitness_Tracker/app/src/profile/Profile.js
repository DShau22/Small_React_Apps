import React, { Component } from 'react';
import {
  withRouter
} from "react-router-dom";
import UserProfile from "./UserProfile"
import SearchProfile from "./SearchProfile"
import SpaContext from '../Context';

class Profile extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    var { context } = this
    var { username } = this.props.match.params
    // debugger;
    if (username === context.username) {
      // this is the same user who is looking at their own profile
      return ( <UserProfile/> )
    }
    return ( <SearchProfile/> )
  }
}
Profile.contextType = SpaContext
const protoStyle = {
  "border": "solid",
  "marginTop": "10px"
}

export default withRouter(Profile)
