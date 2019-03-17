import React from "react";
import "./Game.css";
import { uniqWith, isEqual } from "lodash";

const CELL_SIZE = 20;
const WIDTH = 1200;
const HEIGHT = 1200;

class Square extends React.Component {
  state = {
    color: ""
  };

  handleClick = () => {
    this.props.onClick(this.props.x, this.props.y);
  };

  render() {
    return (
      <div
        onClick={this.handleClick}
        className="square"
        style={{
          width: CELL_SIZE,
          height: CELL_SIZE,
          backgroundColor: this.props.backgroundColor
        }}
      />
    );
  }
}

class Game extends React.Component {
  constructor() {
    super();
    this.rows = HEIGHT / CELL_SIZE;
    this.cols = WIDTH / CELL_SIZE;
    this.board = this.makeEmptyBoard();
    this.pendingState = [];
    this.pendingDead = [];
  }

  state = {
    cells: [
      [31, 34],
      [32, 34],
      [31, 35],
      [32, 35],
      [33, 36],
      [34, 36],
      [34, 37],
      [33, 37],
      [26, 29],
      [27, 29],
      [28, 29],
      [28, 28],
      [27, 27]
    ],
    isRunning: false
  };

  makeEmptyBoard() {
    let board = [];
    for (let y = 0; y < this.rows; y++) {
      board[y] = [];
      for (let x = 0; x < this.cols; x++) {
        board[y][x] = false;
      }
    }
    return board;
  }

  handleClick = (x, y) => {
    this.board[x][y] = true;
    let addedCell = [x, y];
    this.setState({ cells: [...this.state.cells, addedCell] });
  };

  checkCells = cell => {
    // console.log(cell)
    let counter = 0;
    let isDead = false;

    if (cell === undefined) {
      return console.log("nugs");
    }

    for (let x = -1; x < 2; x++) {
      for (let y = -1; y < 2; y++) {
        if (this.board[cell[0] + x] === undefined) {
          return this.cellAction(cell);
        }
        if (this.board[cell[0]][cell[1]]) {
          if (this.board[cell[0] + x][cell[1] + y]) {
            counter++;
          } else {
            this.checkCells([cell[0] + x, cell[1] + y]);
          }
        } else {
          isDead = true;
          if (this.board[cell[0] + x][cell[1] + y]) {
            counter++;
          }
        }
      }
    }
    this.cellAction(cell, counter, isDead);
  };

  cellAction = (cell, counter, isDead) => {
    // console.log(cell,counter,isDead)
    if (counter > 2 && counter < 5 && isDead === false) {
      // console.log('ADDING TO PENDING STATE ALIVE',cell,counter,isDead)
      return (this.pendingState = [...this.pendingState, cell]);
    }
    if (counter === 3 && isDead === true) {
      // console.log('ADDING TO PENDING STATE DEAD',cell,counter,isDead)
      return (this.pendingState = [...this.pendingState, cell]);
    } else {
      return (this.pendingDead = [...this.pendingDead, cell]);
    }
  };

  playGame = () => {
    console.log("playing");
    this.state.cells.map(x => {
      this.checkCells(x);
    });
    this.pendingState = uniqWith(this.pendingState, isEqual);
    this.pendingState.map(x => {
      this.board[x[0]][x[1]] = true;
    });
    this.pendingDead.map(x => {
      this.board[x[0]][x[1]] = false;
    });
    this.setState({ cells: this.pendingState });
    this.pendingState = [];
    this.pendingDead = [];
    this.timeoutHandler = window.setTimeout(() => {
      this.playGame();
    }, 100);
  };

  startGame = () => {
    this.state.cells.map(x => {
      this.board[x[0]][x[1]] = true;
    });
    this.setState({ isRunning: true });
    this.playGame();
  };

  stopGame = () => {
    this.setState({ isRunning: false });
    if (this.timeoutHandler) {
      window.clearTimeout(this.timeoutHandler);
      this.timeoutHandler = null;
    }
  };

  render() {
    let squares = [];
    for (let x = 10; x < 50; x++) {
      for (let y = 10; y < 50; y++) {
        let a = JSON.stringify(this.state.cells);
        let b = JSON.stringify([x, y]);
        if (a.indexOf(b) === -1) {
          squares.push(
            <Square backgroundColor="" onClick={this.handleClick} x={x} y={y} />
          );
        } else {
          squares.push(
            <Square
              backgroundColor="white"
              onClick={this.handleClick}
              x={x}
              y={y}
            />
          );
        }
      }
    }
    return (
      <div className="page">
        <div
          className="Board"
          style={{
            width: 800,
            height: 800,
            backgroundSize: `${CELL_SIZE}px ${CELL_SIZE}px`
          }}
        >
          {squares}
        </div>
        {this.state.isRunning ? (
          <div className="runbutton">
            <button className="button" onClick={this.stopGame}>
              Stop
            </button>
          </div>
        ) : (
          <div className="runbutton">
            <button className="button" onClick={this.startGame}>
              Run
            </button>
          </div>
        )}
      </div>
    );
  }
}

export default Game;
