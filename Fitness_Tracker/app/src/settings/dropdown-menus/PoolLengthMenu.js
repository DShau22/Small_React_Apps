import React from 'react'
import Popup from "reactjs-popup";

export default function PoolLengthMenu(props) {
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
          <a className="dropdown-item" href="#" onClick={props.onSelect}>25 yd</a>
          <a className="dropdown-item" href="#" onClick={props.onSelect}>25 m</a>
          <a className="dropdown-item" href="#" onClick={props.onSelect}>50 m</a>
          <a className="dropdown-item" href="#" onClick={props.onCustomSwimClick}>Custom</a>
        </div>
      </div>
    </div>
  )
}
