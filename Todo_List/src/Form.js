import React, { Component } from 'react'

class Form extends Component {
  state = {
    entry: ""
  }

  onChange = (e) => {
    this.setState({
      [e.target.name] : e.target.value
    })
  }

  onSubmit = (e) => {
    e.preventDefault()
    this.props.addTodo(this.state.entry)
    this.setState({
      [e.target.name]: ""
    })
  }

  render() {
    return (
      <form style={formStyle}>
        <input
          type="text"
          name="entry"
          placeholder="add Todo"
          style={enterStyle}
          value={this.state.entry}
          onChange = {this.onChange}
        />
        <input type="submit" value="submit" style={submitStyle} onClick={this.onSubmit}/>
      </form>
    )
  }
}

const submitStyle = {
  backgroundColor: "gray",
  color: "white",
  float: "right",
  padding: "5px",
  cursor: "pointer",
  flex: "1"
}

const enterStyle = {
  flex: "10",
  padding: "5px"
}

const formStyle = {
  padding: "10px"
}
export default Form;
