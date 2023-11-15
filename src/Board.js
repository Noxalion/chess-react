import { useState } from "react";

//pour former le plateau et ses intéractions
function Board(props) {
    //réattribut les props définis dans Game
    let {fullBoard} = props;
    
    let squares = [];
    let squareColor;
    //index de la case selectionnée
    const [selectedIndex, setSelectedIndex] = useState("");
    const [selectedDestination, setSelectedDestination] = useState("");
    const [selectPiece, setSelectPiece] = useState(true);
    const [pieceSelected, setPieceSelected] = useState(null);
    
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
                    isThereAPiece={thereIs} 
                    row={i} 
                    column={j} 
                    pieceOnSquare={pieceInRow}
                    selectedIndex={selectedIndex}
                    selectedDestination={selectedDestination}
                ></Square>
            );
        }
    }
    
    //au clique d'une case
    function moveClicked(row, column){
        let rowOfPiece = fullBoard[row];
        
        if (selectPiece) {
            if (rowOfPiece[column] === ' ') {
                //si clique sur une case sans pièce
                setSelectedIndex('');
                setSelectedDestination('');
                setPieceSelected(null);
    
                console.log("clicked on empty " + (row + 1) + "-" + (column + 1));
            }else{
                //si clique sur une case avec pièce
                setSelectedIndex(row + '-' + column);
                setSelectedDestination('');
                setSelectPiece(false);
    
                let pieceInRow = rowOfPiece[column];
                let pieceHere = identifyPiece(pieceInRow);
                setPieceSelected({
                    side: pieceHere.side,
                    type: pieceHere.type,
                    name: pieceHere.name,
                    coordinates: row + '-' + column
                });
    
                console.log("clicked on the " + pieceHere.side + " " + pieceHere.name + " on " + (row + 1) + "-" + (column + 1));
            }
        }else{
            if (rowOfPiece[column] === ' ') {
                //si clique sur une case sans pièce
                setSelectedIndex('');
                setSelectedDestination(row + '-' + column);
                setSelectPiece(true);
    
                console.log("the " + pieceSelected.side + " " + pieceSelected.name + " move to destination " + (row + 1) + "-" + (column + 1));
                setPieceSelected(null);
            }else{
                let pieceInRow = rowOfPiece[column];
                let pieceHere = identifyPiece(pieceInRow);

                if (row + '-' + column === pieceSelected.coordinates){
                    setSelectedIndex('');
                    setSelectedDestination('');
                    setSelectPiece(true);

                    console.log("deselected the " + pieceSelected.side + " " + pieceSelected.name);
                    setPieceSelected(null);
                }else if (pieceHere.side === pieceSelected.side) {
                    setSelectedIndex(row + '-' + column);
                    setSelectedDestination('');
                    setPieceSelected({
                        side: pieceHere.side,
                        type: pieceHere.type,
                        name: pieceHere.name,
                        coordinates: row + '-' + column
                    });

                    console.log("clicked on the " + pieceHere.side + " " + pieceHere.name + " on " + (row + 1) + "-" + (column + 1));
                }else{
                    setSelectedIndex('');
                    setSelectedDestination(row + '-' + column);
                    setSelectPiece(true);

                    console.log("the " + pieceSelected.side + " " + pieceSelected.name + " take the " + pieceHere.side + " " + pieceHere.name + " on " + (row + 1) + "-" + (column + 1));
                    setPieceSelected(null);
                }
            }
        }
    }
        
    return squares;
}
    
    
    
//function caractérisant une case
function Square({position, color, onSquareClick, isThereAPiece, row, column, pieceOnSquare, selectedIndex, selectedDestination}){
    
    let squareRender;

    let squareAspect;
    if (selectedIndex === row + '-' + column) {
        squareAspect = "square " + color + " square--selected";
    }else if (selectedDestination === row + '-' + column) {
        squareAspect = "square " + color + " square--move";
    }else{
        squareAspect = "square " + color;
    }
    
    if (isThereAPiece) {
        let pieceHere = identifyPiece(pieceOnSquare);
    
        squareRender = (<li className={squareAspect} key={position} onClick={onSquareClick}>
                            <div className={`piece ${pieceHere.side} ${pieceHere.name} c${row}-${column}`} key={pieceHere.type + row + "-" + column}>{pieceHere.type}</div>
                        </li>);
    }else{
        squareRender = (<li className={squareAspect} key={position} onClick={onSquareClick}></li>);
    }
    
    return (squareRender);
}


//function pour identifier une pièce
function identifyPiece(pieceNotation){
    pieceNotation.split();
    
    let tableName = {
        p: "pawn",
        h: "horse",
        b: "bishop",
        c: "castle",
        k: "king",
        q: "queen"
    };

    let team = (pieceNotation[0] === "b") ? "black" : "white";
    
    let pieceIdentified = {
        side: team,
        type: pieceNotation[1],
        name: tableName[pieceNotation[1]]
    };

    return pieceIdentified;
}


export default Board;