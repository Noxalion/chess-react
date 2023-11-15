//pour former le plateau et ses intéractions
function Board(props) {
    //réattribut les props définis dans Game
    let {fullBoard} = props;

    let squares = [];
    let squareColor;

    for (let i = 0; i < 8; i++) {
        let rowOfPiece = fullBoard[i];
        for (let j = 0; j < 8; j++) {
            //alternance des cases noires et blancs pour le damier
            if (i % 2 === 0) {
                if (j % 2 === 0) {
                squareColor = "white";
                }else{
                squareColor = "black";
                }
            }else{
                if (j % 2 === 0) {
                squareColor = "black";
                }else{
                squareColor = "white";
                }
            }

            let pieceInRow = rowOfPiece[j];

            let thereIs = false;
            if (pieceInRow !== " ") {
                thereIs = true;
            }
            
            squares.push(
                <Square 
                    key={i + "-" + j} 
                    color={squareColor} 
                    onSquareClick={() => moveClicked(i, j)} 
                    isThereAPiece={thereIs} row={i} column={j} 
                    pieceOnSquare={pieceInRow}
                ></Square>
            );
        }
    }

    //au clique d'une case
    function moveClicked(row, column){
        let rowOfPiece = fullBoard[row];
        if (rowOfPiece[column] === ' ') {
            console.log("clicked on empty " + (row + 1) + "-" + (column + 1));
        }else{
            console.log("clicked on the piece on " + (row + 1) + "-" + (column + 1));
        }
    }

    return squares;
}



//function caractérisant une case
function Square({position, color, onSquareClick, isThereAPiece, row, column, pieceOnSquare}){
let squareRender;

if (isThereAPiece) {
    pieceOnSquare.split();
    let team;
    if (pieceOnSquare[0] === "b") {
        team = "black";
    }else{
        team = "white";
    }

    squareRender = (<li className={"square " + color} key={position} onClick={onSquareClick}>
                        <div className={`piece ${team} ${pieceOnSquare[1]} c${row}-${column}`} key={pieceOnSquare[1] + row + "-" + column}>{pieceOnSquare[1]}</div>
                    </li>);
}else{
    squareRender = (<li className={"square " + color} key={position} onClick={onSquareClick}></li>);
}

    return (squareRender);
}


export default Board;