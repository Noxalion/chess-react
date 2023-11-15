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
                setIndexAndDestination("", "");
                
            }else{
                //si clique sur une case avec pièce
                let pieceInRow = rowOfPiece[column];
                let pieceHere = identifyPiece(pieceInRow);

                let pieceSelected = {
                    side: pieceHere.side,
                    type: pieceHere.type,
                    name: pieceHere.name,
                    coordinates: row + '-' + column
                };

                setIndexAndDestination(row + '-' + column, "", pieceSelected, false);
            }
        }else{
            if (rowOfPiece[column] === ' ') {
                //si clique sur une case sans pièce (bouge la pièce)
                setIndexAndDestination('', row + '-' + column);

            }else{
                let pieceInRow = rowOfPiece[column];
                let pieceHere = identifyPiece(pieceInRow);

                if (row + '-' + column === pieceSelected.coordinates){
                    //si clique sur la même case (déselectionne)
                    setIndexAndDestination('', '');

                }else if (pieceHere.side === pieceSelected.side) {
                    //si clique sur une case avec une pièce alliée (la selectionne alors)
                    let pieceSelected = {
                        side: pieceHere.side,
                        type: pieceHere.type,
                        name: pieceHere.name,
                        coordinates: row + '-' + column
                    };

                    setIndexAndDestination(row + '-' + column, '', pieceSelected, false);

                }else{
                    //si clique sur une case avec un poèce adverse (la mange)
                    setIndexAndDestination('', row + '-' + column);
                }
            }
        }

        console.log("index :" + selectedIndex);
        console.log("destination :" + selectedDestination);
        console.log("pieceSelected :" + pieceSelected);
        console.log("selectPiece :" + selectPiece);
    }

    function setIndexAndDestination(index, destination, piece = null, selectPiece = true){
        setSelectedIndex(index);
        setSelectedDestination(destination);
        setPieceSelected(piece);
        setSelectPiece(selectPiece);
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