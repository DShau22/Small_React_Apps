import React, { Component } from 'react'
import RedirectBox from "../generic/RedirectBox"
import SpaContext from "../Context"
import {
  withRouter
} from "react-router-dom";
import './settings.css'
import $ from 'jquery';

const friendsListHelpMsg = 'set who can see your friends list on you profile'
const fitnessHelpMsg = 'set who can see your fitness stats such as average number of steps taken per day, calories burned, etc.'
const basicInfoHelpMsg = 'set who can see descriptions about you such as your bio, height, weight, etc.'
const unitSystemHelpMsg = 'set what unit system you would prefer to view measurements in'

class Settings extends Component {
  constructor(props) {
    super(props)
  
    this.state = {
       
    }
    this.saveSettings = this.saveSettings.bind(this)
  }
  
  // below is for initalizing tooltips
  componentDidMount() {
    $('[data-toggle="tooltip"]').tooltip();
  }
  
  componentDidUpdate() {
    $('[data-toggle="tooltip"]').tooltip();
  }

  saveSettings() {
    console.log('saving settings...')
  }

  renderDropDown(dropdownText) {
    return (
      <div className='settings-dropdown'>
        <div className="btn-group">
        <button type="button" className="btn btn-primary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          Action
        </button>
        <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
          <a className="dropdown-item" href="#">Action</a>
          <a className="dropdown-item" href="#">Another action</a>
          <a className="dropdown-item" href="#">Something else here</a>
        </div>
        </div>
      </div>
    )
  }
  
  render() {
    var { match } = this.props
    return (
    //   <i
    //   type="button"
    //   className="fa help-icon"
    //   data-toggle="tooltip"
    //   data-placement="top"
    //   title="Tooltip on left"
    // >
    //   &#xf059;
    // </i>
      <div className='settings-container'>
        <ul className='settings-list'>
          <li className='settings-list-item'>
            <i
              className="fa help-icon"
              data-toggle="tooltip"
              data-placement="top"
              title={friendsListHelpMsg}
            >
              &#xf059;
            </i>
            <span className='setting-text'>Who can see your friends list?</span>
            {this.renderDropDown('spaContext')}
          </li>
          <li className='settings-list-item'>
            <i
              className="fa help-icon"
              data-toggle="tooltip"
              data-placement="top"
              title={fitnessHelpMsg}
            >
              &#xf059;
            </i>
            <span className='setting-text'>Who can see your fitness?</span>
            {this.renderDropDown()}
          </li>
          <li className='settings-list-item'>
            <i
              className="fa help-icon"
              data-toggle="tooltip"
              data-placement="top"
              title={basicInfoHelpMsg}
            >
              &#xf059;
            </i>
            <span className='setting-text'>Who can see your basic info?</span>
            {this.renderDropDown()}
          </li>
          <li className='settings-list-item'>
            <i
              className="fa help-icon"
              data-toggle="tooltip"
              data-placement="top"
              title={unitSystemHelpMsg}
            >
              &#xf059;
            </i>
            <span className='setting-text'>Unit system to display</span>
            {this.renderDropDown()}
          </li>
          <li className='settings-list-item'>
            <div className='help-icon empty-space'></div>
            <div className='setting-text empty-space'></div>
            <div className='save-settings'>
              <button 
                className='save-settings-btn btn btn-primary'
                onClick={this.saveSettings}
              >
                Save
              </button>
            </div>
          </li>
        </ul>
      </div>
    )
  }
}

Settings.contextType = SpaContext

export default withRouter(Settings)

