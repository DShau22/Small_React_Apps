import React, { Component } from 'react'

const TableHeader = () => {
  return (
    <thead>
      <tr>
        <th>Name</th>
        <th>Job</th>
      </tr>
    </thead>
  )
}

const TableBody = props => {
  console.log(props.charData)
  const rows = props.charData.map((row, index) => {
    return (
      <tr key={index}>
        <td>{row.name}</td>
        <td>{row.job}</td>
        <td>
          <button onClick = {() => props.removeCharacter(index)}>Delete</button>
        </td>
      </tr>
    )
  })
  return <tbody>{rows}</tbody>
}

class Table extends Component {
  render() {
    const {charData} = this.props
    const {removeCharacter} = this.props
    return (
      <table>
        <TableHeader />
        <TableBody charData={charData} removeCharacter = {removeCharacter}/>
      </table>
    )
  }
}

export default Table
