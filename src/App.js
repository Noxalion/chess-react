import './App.css';

function Piece(row, column, maxRows, team, onPieceClicked) {
  let type = null;
  let letter;

  if (row == 1 || row == maxRows - 2) {
    type = "pawn";
    letter = "P";
  }else if (row == 0 || row == maxRows - 1) {
    if (column == 0 || column == 7) {
      type = "castle";
      letter = "C";
    }else if (column == 1 || column == 6) {
      type = "horse";
      letter = "H";
    }else if (column == 2 || column == 5) {
      type = "bishop";
      letter = "B";
    }else if (column == 3) {
      type = "queen";
      letter = "Q";
    }else{
      type = "king";
      letter = "K";
    }
  }
  
  if (type !== null) {
    return(<li className={`piece ${team} ${type} c${row}-${column}`} key={letter + row + "-" + column} onClick={onPieceClicked}>{letter}</li>);
  }
}



function Pieces(onPieceClicked) {
  let pieces = [];
  let team = "white";

  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      if (i >= 4) {
        team = "black";
      }
      pieces.push(Piece(i, j, 8, team, onPieceClicked));
    }
  }

  return pieces;
}



function Board() {
  var squares = [];
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      if (i % 2 == 0) {
        if (j % 2 == 0) {
          squares.push(<li className="case black" key={i + "-" + j} ></li>);
        }else{
          squares.push(<li className="case" key={i + "-" + j}></li>);
        }
      }else{
        if (j % 2 == 0) {
          squares.push(<li className="case" key={i + "-" + j}></li>);
        }else{
          squares.push(<li className="case black" key={i + "-" + j}></li>);
        }
      }
    }
  }
  return squares;
}



function Game() {
  let board = Board();
  let pieces = Pieces();
  function moveClicked(i){

  }

  return (
    <div className='game'>
      <ul className="game__el board">
        {board}
      </ul>
      <ul className="game__el pieces">
        {pieces}
      </ul>
    </div>
  );
}

export default Game;
