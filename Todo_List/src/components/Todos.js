import React, { Component } from 'react'
import TodoItem from './TodoItem'
class Todos extends Component {
  getStyle = (todo) => {
    return todo.completed ? compDivStyle : divStyle
  }

  render() {
    const {todos, complete, deleteTodo} = this.props

    return (
      todos.map((todo, index) => {
        return (
          <div id={todo.id} style={this.getStyle(todo)}>
            <TodoItem todo={todo} complete={complete} deleteTodo={deleteTodo}/>
          </div>
        )
      })
    )

  }
}

const divStyle = {
  color: "black",
  padding: '10px',
  backgroundColor: "WhiteSmoke",
  borderBottom: '1px #ccc dotted'
}

const compDivStyle = {
  color: "black",
  padding: '10px',
  backgroundColor: "WhiteSmoke",
  borderBottom: '1px #ccc dotted',
  textDecoration: 'line-through'
}

export default Todos
