import './App.css';

function squares() {
  var rows = [];
  var lines = [];
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      if (i % 2 == 0) {
        if (j % 2 == 0) {
          squares.push(<div className="case black"></div>);
        }else{
          squares.push(<div className="case"></div>);
        }
      }else{
        if (j % 2 == 0) {
          squares.push(<div className="case"></div>);
        }else{
          squares.push(<div className="case black"></div>);
        }
      }
    }
  }
  return squares;
}

console.log(squares());

function Board() {
  return (
    <div className="board">
      {squares()}
    </div>
  );
}

export default Board;
