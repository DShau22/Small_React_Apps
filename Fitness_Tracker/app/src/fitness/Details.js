import React from 'react'
import {
  Redirect,
  NavLink,
} from "react-router-dom"

export default function Details( props ) {
  return (
    <div className="mt-3">
      <NavLink
        className="btn btn-primary"
        id="details"
        to={props.detailsLink}
      >
        details
      </NavLink>
    </div>
  )
}
