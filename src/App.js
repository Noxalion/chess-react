import './App.css';

function squares() {
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

function Board() {
  return (
    <ul className="board">
      {squares()}
    </ul>
  );
}

export default Board;
