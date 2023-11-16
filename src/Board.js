import { useState } from "react";

//pour former le plateau et ses intéractions
function Board(props) {
    //réattribut les props définis dans Game
    let {pieces, setPieces} = props;
    
    let squares = [];
    let squareColor;
    //origine de la pièce selectionnée
    const [originCoordinates, setOriginCoordinates] = useState("");
    //destination de la pièce selectionnée
    const [destinationCoordinates, setDestinationCoordinates] = useState("");
    //état de la selection
    const [selectionState, setSelectionState] = useState("selectPiece");
    //object avec les infos sur la pièce selectionnée
    const [pieceSelected, setPieceSelected] = useState(null);
    
    for (let i = 0; i < 8; i++) {
        let rowOfPiece = pieces[i];
        for (let j = 0; j < 8; j++) {
            //alternance des cases noires et blancs pour le damier
            squareColor = (i + j) % 2 === 0 ? "white" : "black";
    
            let piece = rowOfPiece[j];

            squares.push(
                <Square 
                    key={i + "-" + j} 
                    color={squareColor} 
                    onSquareClick={() => moveClicked(i, j)}
                    row={i} 
                    column={j} 
                    pieceOnSquare={piece}
                    originCoordinates={originCoordinates}
                    destinationCoordinates={destinationCoordinates}
                ></Square>
            );
        }
    }
    
    //au clique d'une case
    function moveClicked(row, column){
        let piece = pieces[row][column];
        
        if (selectionState === "selectPiece" && piece !== '  ') {
            //au début du tour pour pouvoir selectionner une pièce que l'on veut déplacer (fait rien si clique sur une case sans pièce)
            
            let pieceHere = identifyPiece(piece, row, column);
            setOriginAndDestination(row + '-' + column, "", pieceHere, "selectMove");
        }else if (selectionState === "selectMove"){
            //pour après avoir selectionner une pièce
            if (piece === '  ') {
                //si clique sur une case sans pièce (bouge la pièce)
                setOriginAndDestination('', row + '-' + column);

            }else{
                //si clique sur une case avec pièce
                let pieceHere = identifyPiece(piece, row, column);

                if (pieceHere.coordinates === pieceSelected.coordinates){
                    //si clique sur la même case (déselectionne)
                    setOriginAndDestination('', '');

                }else if (pieceHere.side === pieceSelected.side) {
                    //si clique sur une case avec une pièce alliée (la selectionne alors)

                    setOriginAndDestination(row + '-' + column, '', pieceHere, "selectMove");

                }else{
                    //si clique sur une case avec un poèce adverse (la mange)
                    setOriginAndDestination('', row + '-' + column);
                }
            }
        }
    }

    function setOriginAndDestination(origin, destination, piece = null, selectionState = "selectPiece"){
        setOriginCoordinates(origin);
        setDestinationCoordinates(destination);
        setPieceSelected(piece);
        setSelectionState(selectionState);

        //juste pour voir dans la console debug les actions faites
        console.log("----------------------------------");
        console.log("NOUVELLE ACTION");
        console.log("origin: " + origin);
        console.log("destination: " + destination);
        console.log("pieceSelected: " + ((piece !== null) ? piece.side + " " + piece.name : "aucune"));
        console.log("next selectionState: " + selectionState);
    }
        
    return squares;
}
    
    
    
//function caractérisant une case
function Square({position, color, onSquareClick, row, column, pieceOnSquare, originCoordinates, destinationCoordinates}){

    let squareAspect;
    if (originCoordinates === row + '-' + column) {
        squareAspect = "square " + color + " square--selected";
    }else if (destinationCoordinates === row + '-' + column) {
        squareAspect = "square " + color + " square--move";
    }else{
        squareAspect = "square " + color;
    }
    
    let isThereAPiece = (pieceOnSquare !== "  ");
    let pieceHere = identifyPiece(pieceOnSquare, row, column);
    let classes = `piece ${pieceHere.side} ${pieceHere.name} sq${pieceHere.coordinates}`;

    return (
        <li 
            className={squareAspect}
            key={position}
            onClick={onSquareClick}
        >
            {isThereAPiece && 
                <div 
                    className={classes} 
                    key={pieceHere.type + pieceHere.coordinates}
                >
                    {pieceHere.type}
                </div>
            }
        </li>
    );
}


//function pour identifier une pièce et crée l'object quand une pièce est selectionnée
function identifyPiece(pieceNotation, row, column){
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
    
    let pieceInfo = {
        side: team,
        type: pieceNotation[1],
        name: tableName[pieceNotation[1]],
        coordinates: row + '-' + column
    };

    return pieceInfo;
}


export default Board;