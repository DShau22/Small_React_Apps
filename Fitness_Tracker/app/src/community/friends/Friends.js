import React, { Component } from 'react'
import SpaContext from '../../Context';

class Friends extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    var { friendTableRows } = this.context
    return (
      <div>
        <table className="table table-hover">
          <thead>
            <tr>
              <th scope="col">Rank</th>
              <th scope="col">Pic</th>
              <th scope="col">Name</th>
              <th scope="col">Run</th>
              <th scope="col">Jump</th>
              <th scope="col">Swim</th>
            </tr>
          </thead>
          <tbody>
            {friendTableRows}
            {/* add friends list here */}
          </tbody>
        </table>
      </div>
    )
  }
}

Friends.contextType = SpaContext

export default Friends
