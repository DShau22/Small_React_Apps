import React from 'react'

export default function PrivacyMenu(props) {
  return (
    <div className='settings-dropdown'>
      <div className="btn-group">
      <button
        type="button"
        className="btn btn-primary dropdown-toggle"
        data-toggle="dropdown"
        aria-haspopup="true"
        aria-expanded="false"
      >
        {props.dropdownText}
      </button>
      <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
        <a className="dropdown-item" href="#" onClick={props.onSelect}>everyone</a>
        <a className="dropdown-item" href="#" onClick={props.onSelect}>friends</a>
        <a className="dropdown-item" href="#" onClick={props.onSelect}>just me</a>
      </div>
      </div>
    </div>
  )
}
