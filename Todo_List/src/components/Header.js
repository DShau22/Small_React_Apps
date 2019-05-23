import React, { Component } from 'react'

function Header() {
  return <header style = {headerStyle}>
            My To-do List :)
         </header>
}

const headerStyle = {
  backgroundColor: "black",
  color: "white",
  textAlign: "center",
  fontSize: 30,
  padding: 10
}

export default Header
