import React, { Component } from 'react';
import {
  getFromLocalStorage,
  getFromSessionStorage,
  storageKey,
} from '../utils/storage';
import SpaContext from '../Context';

// server url
const serverURL = "http://localhost:8080"
const getUserInfoURL = `${serverURL}/getUserInfo`
const updateProfileURL = `${serverURL}/updateProfile`
const checkDuplicateURL = `${serverURL}/checkDuplicatePic`
const uploadPicURL = `${serverURL}/uploadProfilePic`

const imgAlt = "./default_profile.png"
class EditProfile extends Component {
  _isMounted = false
  constructor(props) {
    super(props)
    this.firstNameInput = React.createRef()
    this.lastNameInput = React.createRef()
    this.state = {
      updateFirstName: "",
      updateLastName: "",
      updateBio: "",
      updateLocation: "",
      updateGender: "",
      updateHeightCm: 0,
      updateHeightIn: 0,
      updateHeightFt: 0,
      updateWeight: 0,
      settings: {},
      picFile: null,
      currProfilePicInfo: {}
    }

    this.updateProfile = this.updateProfile.bind(this)
    this.onFirstNameChange = this.onFirstNameChange.bind(this)
    this.onLastNameChange = this.onLastNameChange.bind(this)
    this.onBioChange = this.onBioChange.bind(this)
    this.onLocationChange = this.onLocationChange.bind(this)
    this.onGenderChange = this.onGenderChange.bind(this)
    this.onHeightFtChange = this.onHeightFtChange.bind(this)
    this.onHeightInChange = this.onHeightInChange.bind(this)
    this.onHeightCmChange = this.onHeightCmChange.bind(this)
    this.onWeightChange = this.onWeightChange.bind(this)
    this.displayWeight = this.displayWeight.bind(this)
    this.addFile = this.addFile.bind(this)
    this.onUpdateClick = this.onUpdateClick.bind(this)
  }

  getToken() {
    var lsUserToken = getFromLocalStorage(storageKey)
    var ssUserToken = getFromSessionStorage(storageKey)
    if (lsUserToken) {
      return lsUserToken.token
    } else if (ssUserToken) {
      return ssUserToken.token
    } else {
      return null
    }
  }

  async componentDidMount() {
    this._isMounted = true
    console.log("edit profile mounted")
    
    var userToken = this.getToken()

    // fetch user information, can't use context cuz this component mounts
    // before the spa component and will only have access to the initial context
    // fill in the update fields with what the user has already
    var headers = new Headers()
    headers.append("authorization", `Bearer ${userToken}`)
    console.log("before awaiting")
    var res = await fetch(getUserInfoURL, { method: "GET", headers })
    var json = await res.json()
    console.log(json)
    var { firstName, lastName, gender, bio, height, weight, location, settings, profilePicture } = json
    var { unitSystem } = settings

    // set update height depending on what the user settings are
    var updateHeightFt;
    var updateHeightIn;
    var updateHeightCm;
    if (unitSystem === "English") {
      // height is in inches
      updateHeightFt = Math.floor(height / 12)
      updateHeightIn = Math.round(height - (12 * updateHeightFt))
    } else {
      // height is in cm
      updateHeightCm = height
    }
    // negative height means user never set it
    if (height < 0) {
      updateHeightFt = ""
      updateHeightIn = ""
      updateHeightCm = ""
    }
    this.setState({
      updateFirstName: firstName,
      updateLastName: lastName,
      updateGender: gender,
      updateBio: bio,
      updateWeight: weight,
      updateHeightFt,
      updateHeightIn,
      updateHeightCm,
      settings,
      updateLocation: location,
      currProfilePicInfo: profilePicture
    })
  }

  componentWillUnmount() {
    console.log("unmounting editprofile")
    this._isMounted = false
  }
  
  displayWeight() {
    // make sure that the spa component has mounted and has user info
    // in context since child component is rendered and mounted first
    if (this._isMounted) {
      var { updateWeight } = this.state
      var { unitSystem } = this.state.settings
      unitSystem = unitSystem.toLowerCase()
      var units = (unitSystem === "english") ? "lbs" : "kg"
      return (
        <div className="form-group">
          <label>Weight</label>
          <input type="number" placeholder="weight" min="0" value={updateWeight} onChange={this.onWeightChange}/>
          <span>{units}</span>
        </div>
      )
    }
  }

  displayHeightInput() {
    var { updateHeightCm, updateHeightFt, updateHeightIn, settings } = this.state
    var { unitSystem } = settings
    if (unitSystem === "English") {
      return (
        <div className="form-group">
          <label>Height</label>
          <input type="number" value={updateHeightFt} placeholder="feet" min="0" onChange={this.onHeightFtChange}/>
          <span>ft</span>
          <input type="number" value={updateHeightIn} placeholder="inches" min="0" max="11" onChange={this.onHeightInChange}/>
          <span>in</span>
        </div>
      )
    }
    return (
      <div className="form-group">
        <label>Height</label>
        <input type="number" placeholder="cm" value={updateHeightCm} min="0" onChange={this.onHeightCmChange}/>
        <span>cm</span>
      </div>
    )
  }

  onHeightFtChange(e) {
    this.setState({
      updateHeightFt: e.target.value
    })
  }

  onHeightInChange(e) {
    this.setState({
      updateHeightIn: e.target.value
    })
  }

  onHeightCmChange(e) {
    this.setState({
      updateHeightCm: e.target.value
    })
  }

  onWeightChange(e) {
    this.setState({
      updateWeight: e.target.value
    })
  }

  onFirstNameChange(e) {
    this.setState({
      updateFirstName: e.target.value,
    })
  }

  onLastNameChange(e) {
    this.setState({
      updateLastName: e.target.value,
    })
  }

  onBioChange(e) {
    this.setState({
      updateBio: e.target.value,
    })
  }

  onLocationChange(e) {
    this.setState({
      updateLocation: e.target.value,
    })
  }

  onGenderChange(e) {
    this.setState({
      updateGender: e.target.value,
    })
  }

  addFile(e) {
    var file = e.target.files[0]
    console.log(file)
    this.setState({
      picFile: file,
    })
  }

  onUpdateClick() {
    // set custom validations if first or last names are blank
    if (this.firstNameInput.current.validity.valueMissing) {
      this.firstNameInput.current.setCustomValidity("First name cannot be blank")
    } else {
      this.firstNameInput.current.setCustomValidity("")
    }

    if (this.lastNameInput.current.validity.valueMissing) {
      this.lastNameInput.current.setCustomValidity("Last name cannot be blank")
    } else {
      this.lastNameInput.current.setCustomValidity("")
    }
  }

  async updateProfile(e) {
    e.preventDefault()
    
    alert("updating")
    var { updateFirstName, updateLastName, updateBio, updateLocation, updateGender, settings } = this.state
    var { updateHeightFt, updateHeightIn, updateHeightCm, updateWeight } = this.state
    var { picFile, currProfilePicInfo } = this.state
    var { unitSystem } = settings
    unitSystem = unitSystem.toLowerCase()
    var userToken = this.getToken()

    var formData = new FormData();

    formData.append("profilePic", picFile)
    formData.append("currImgHash", currProfilePicInfo.etag)

    // check to see if file was already uploaded in the past
    // turn this into a function that returns a promise later and await/.then it
    if (picFile) {
      var verifyRes = await fetch(checkDuplicateURL, {
        method: "POST",
        body: formData,
      })
      var verifyJson = await verifyRes.json()
      if (!verifyJson.success) {
        alert(verifyJson.message)
        return
      }
      var headers = new Headers()
      headers.append("authorization", `Bearer ${userToken}`)
      var uploadPicRes = await fetch(uploadPicURL, {
        method: "POST",
        headers,
        body: formData
      })
      var uploadPicJson = await uploadPicRes.json()
      if (uploadPicJson.success) {
        alert("successfully updated profile picture!")
      }
    }

    // if unit system is English, convert ft and in into 1 number in inches
    var updateHeight;
    if (unitSystem === "english") {
      if (!updateHeightIn) updateHeightIn = -1
      if (!updateHeightFt) updateHeightFt = -1
      updateHeight = 12 * parseInt(updateHeightFt) + parseInt(updateHeightIn)
    } else {
      if (!updateHeightCm) updateHeightCm = -1
      updateHeight = parseInt(updateHeightCm)
    }

    var reqBody = {
      firstName: updateFirstName,
      lastName: updateLastName,
      bio: updateBio,
      location: updateLocation,
      gender: updateGender,
      weight: updateWeight,
      height: updateHeight,
      userToken,
    }

    var updateRes = await fetch(updateProfileURL, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(reqBody),
    })
    var updateJson = await updateRes.json()
    console.log("aioajweif", updateJson)
    if (updateJson.success) {
      alert("successfully updated profile")
      // do some redirecting back to profile page
    } else {
      alert(updateJson.message)
    }
  }

  render() {
    if (this.context.mounted) {
      return (
        <div className="edit-profile-container">
          <form>
            <div className='form-group prof-pic-container'>
              <img src={this.state.currProfilePicInfo.profileURL} width="300" height="300" alt={imgAlt}/>
              <label>Profile Picture</label>
              <input type="file" onChange={this.addFile} accept="image/x-png,image/jpeg"/>
            </div>
            <div class="form-group">
              <label for='fname'>First Name</label>
              <input
                id='fname'
                type="text"
                className="form-control"
                placeholder="first name"
                onChange={this.onFirstNameChange}
                value={this.state.updateFirstName}
                ref={this.firstNameInput}
                required
              />
            </div>
            <div class="form-group">
              <label for="lname">Last Name</label>
              <input
                id='lname'
                type="text"
                className='form-control'
                placeholder="last name"
                onChange={this.onLastNameChange}
                value={this.state.updateLastName}
                ref={this.lastNameInput}
                required
              />
            </div>
            <div className='form-group'>
              <label for='bio'>Bio</label>
              <textarea
                id='bio'
                className='form-control'
                placeholder="tell us about yourself..."
                onChange={this.onBioChange}
                value={this.state.updateBio}
              />
            </div>
            <div className='form-group'>
              <label for='gender'>Gender</label>
              <input
                id='gender'
                type="text"
                className='form-control'
                placeholder="Male/Female/Other..."
                onChange={this.onGenderChange}
                value={this.state.updateGender}
              />
            </div>
            <div className='form-group'>
              <label for='age'>Age</label>
              <input
                id='age'
                type="number"
                className='form-control'
                placeholder="Male/Female/Other..."
                onChange={this.onGenderChange}
                value={this.state.updateGender}
              />
            </div>
            <div className='form-group'>
              <label for='location'>Location</label>
              <input
                id='location'
                type="text"
                className='form-control'
                placeholder="Your location"
                onChange={this.onLocationChange}
                value={this.state.updateLocation}
              />
            </div>
            {this.displayHeightInput()}
            {this.displayWeight()}
            <input type="submit" className="button" value="Update Profile" id="update-button" onClick={this.onUpdateClick}/>
          </form>
        </div>
      )
    } else {
      // spa hasn't mounted and established context yet
      return (
        <div className="profile-loading-container">
          <span>loading...</span>
        </div>
      )
    }
  }
}
EditProfile.contextType = SpaContext
export default EditProfile
