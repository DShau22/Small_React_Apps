import React, { Component } from 'react'

class TodoItem extends Component {
  render() {
    const {id, event} = this.props.todo
    return (
      <div>
        <input type="checkbox" onChange={this.props.complete.bind(this, id)}/>
        {' '}
        {event}
        <input type="button" value="X" style={buttonStyle} onClick={this.props.deleteTodo.bind(this, id)}/>
      </div>
    )
  }
}

const buttonStyle = {
  display: "flex",
  float: "right",
  background: "red",
  padding: "5px 10px",
  borderRadius: "50%",
  color: "white",
  cursor: "pointer"
}
export default TodoItem
