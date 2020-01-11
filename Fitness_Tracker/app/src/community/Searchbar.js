import React, { Component } from 'react';
import "./style/Searchbar.css"

class Searchbar extends Component {

  render() {
    return (
      <div className="search-box" onMouseLeave={this.props.mouseLeave}>
        <input
          type="text"
          name=""
          className="search-txt"
          placeholder="Type to search"
          onChange={this.props.onSearchTextChange}
          value={this.props.searchText}
        />
        <div
          className="search-btn"
          onClick={this.props.search}
        >
          <i className="fas fa-search"></i>
        </div>
      </div>
    )
  }
}

export default Searchbar
