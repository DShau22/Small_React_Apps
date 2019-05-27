import React, { Component } from 'react'

class Graph extends Component {
  constructor(props) {
    super(props)
    this.state = {
      displayPar: false,
      json: null
    }
  }

  componentDidMount() {
    alert("component did mount")
    const data = new FormData();
    fetch('http://localhost:8080/upload', {method: "POST", body: data})
      .then( (response) => {
        return response.json()
      })
      .then((json) => {
        // this.setState({
        //   json: json
        // })
        console.log("json is", json)
      })
    this.setState({
      displayPar: true
    })
  }

  renderPar() {
    if (this.state.displayPar) {
      return (
        <p>paragraphawefawejfaiowejfoiajowefiaw!</p>
      )
    }
  }

  render() {
    return (
      <div>
        <h2>HelLO i aM gRaPH</h2>
        {this.renderPar()}
      </div>
    );
  }
}

export default Graph;
