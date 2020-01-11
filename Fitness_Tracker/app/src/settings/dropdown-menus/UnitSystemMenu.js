import React from 'react'

export default function UnitSystemMenu(props) {
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
        <a className="dropdown-item" href="#" onClick={props.onSelect}>English</a>
        <a className="dropdown-item" href="#" onClick={props.onSelect}>metric</a>
      </div>
      </div>
    </div>
  )
}
