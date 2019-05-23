import React, { Component } from 'react'
import Table from './Table'
import Header from './components/Header'
import Form from './Form'
import Todos from './components/Todos'
import uuid from "uuid"

class App extends Component {
  state = {
    todos: [
      {
        id: 1,
        event: 'finish project',
        completed: false
      },
      {
        id: 2,
        event: 'eat gud stuff',
        completed: false
      }
    ]
  }

  complete = (id) => {
    this.setState(
      {
        todos: this.state.todos.map(todo => {
          if (todo.id === id) {
            todo.completed = !todo.completed
          }
          return todo
        })
      }
    )
  }

  deleteTodo = (id) => {
    console.log(id)
    this.setState({
      todos: this.state.todos.filter(todo => {
        return todo.id !== id
      })
    })
  }

  addTodo = (title) => {
    const newTodo = {
      id: 4,
      event: title,
      completed: false
    }
    this.setState({
      todos: [...this.state.todos, newTodo]
    })
  }

  render() {
    return (
      <div className="container">
        <Header />
        <Form addTodo={this.addTodo}/>
        <Todos todos={this.state.todos} complete={this.complete} deleteTodo={this.deleteTodo}/>
      </div>
    )
  }
}

export default App
