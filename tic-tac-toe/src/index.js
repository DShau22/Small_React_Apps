import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props){
  return (
    <button
      className="square"
      onClick={props.onClick}
      style={{cursor:"pointer"}}
    >
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return <Square
              value={this.props.squares[i]}
              onClick={()=>{this.props.onClick(i)}}
            />;
  }

  render() {
    return (
      <div>
        <div className="status"
              style={{textAlign: "center"}}
        >
          {this.props.status}
        </div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      history: [{
        squares: Array(9).fill(null)
      }],
      xNext: true,
      step: 0
    }
  }

  handleClick(i) {
    const {history, step} = this.state
    const present = history[history.length - 1]
    const presentSquares = present.squares
    if (calculateWinner(presentSquares) || presentSquares[i]) {
      return;
    }
    const newSquares = presentSquares.slice()
    newSquares[i] = (this.state.xNext ? 'X' : 'O')
    this.setState({
      history: history.concat([{
        squares: newSquares
      }]),
      xNext: !this.state.xNext,
      step: step + 1
    })
  }

  jumpTo = (step) => {
    this.setState({
      step: step
    })
  }

  render() {
    const {history, step} = this.state
    const present = history[history.length - 1]
    const presentSquares = present.squares

    const winner = calculateWinner(presentSquares)
    let status = 'Next player: ' + (this.state.xNext ? 'X' : 'O');
    if (winner !== null) {
      status = 'Winner is ' + winner + "'s!'"
    }

    const moves = history.map((grid, move) => {
      const moveNumber = (move ? move : "game start")
      return (
        <li key={move}>
          <button
            onClick={() => this.jumpTo(move)}
            style={{cursor: "pointer", background: "gray", color: "white"}}
          >
            {"move #: " + moveNumber}
          </button>
        </li>
      )
    })

    return (
      <div className="game">
        <div className="game-board">
          <Board squares={history[step].squares} status={status} onClick={(i) => this.handleClick(i)}/>
        </div>
        <div className="game-info">
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
