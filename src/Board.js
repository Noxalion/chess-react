import { useState } from "react";
import findMovement from './utils/ChessMovement';

//pour former le plateau et ses intéractions
function Board(props) {
    //réattribut les props définis dans Game
    let {pieces, setPieces} = props;
    
    let squares = [];
    let squareColor;
    //état de la selection
    const [selectionState, setSelectionState] = useState("selectPiece");
    //object avec les infos sur la pièce selectionnée
    const [pieceSelected, setPieceSelected] = useState(null);
    //montre les possibilités de déplacement de la pièce
    const [possibilitiesOfMoves, setPossibilitiesOfMoves] = useState([]);
    
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
                    onSquareClick={() => clickOnSquare(i, j)}
                    row={i} 
                    column={j}
                    identifyPiece={identifyPiece}
                    pieceOnSquare={piece}
                    pieceSelected={pieceSelected}
                    possibilitiesOfMoves={possibilitiesOfMoves}
                ></Square>
            );
        }
    }
    
    //au clique d'une case
    function clickOnSquare(row, column){
        let piece = pieces[row][column];
        
        if (selectionState === "selectPiece" && piece !== '  ') {
            //au début du tour pour pouvoir selectionner une pièce que l'on veut déplacer (fait rien si clique sur une case sans pièce)
            let pieceHere = identifyPiece(piece, row, column);
            setPieceToMove(pieceHere);

        }else if (selectionState === "selectMove"){
            //pour après avoir selectionner une pièce
            if (possibilitiesOfMoves.includes(row + '-' + column) && piece === '  ') {
                //si clique sur une case sans pièce (bouge la pièce)
                goToDestination(row + '-' + column);

            }else{
                //si clique sur une case avec pièce
                let pieceHere = identifyPiece(piece, row, column);

                if (pieceHere.coordinates === pieceSelected.coordinates){
                    //si clique sur la même case (déselectionne)
                    deselectPiece();

                }else if (pieceHere.side === pieceSelected.side) {
                    //si clique sur une case avec une pièce alliée (la selectionne alors)
                    setPieceToMove(pieceHere);

                }else if(possibilitiesOfMoves.includes(row + '-' + column)){
                    //si clique sur une case avec un pièce adverse (la mange)
                    goToDestination(row + '-' + column);
                }
            }
        }
    }

    //function déselectionnant la pièce précédemment choisie
    function deselectPiece(){
        setPieceSelected(null);
        setSelectionState("selectPiece");
        setPossibilitiesOfMoves([]);
    }

    //function enregistrant quelle pièce est à déplacer et depuis où
    function setPieceToMove(piece){
        setPieceSelected(piece);
        setSelectionState("selectMove");
        setPossibilitiesOfMoves(findMovement(piece, pieces, identifyPiece));
    }

    //function appliquant le déplacement choisi de la pièce
    function goToDestination(destination){
        let startingCoordinates = pieceSelected.coordinates.split('-');
        let finishCoordinates = destination.split('-');

        const nextPieces = pieces.slice();
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                nextPieces[i][j].slice();
            }
        }

        let squareOfStart = nextPieces[startingCoordinates[0]][startingCoordinates[1]];
        nextPieces[startingCoordinates[0]][startingCoordinates[1]] = "  ";
        nextPieces[finishCoordinates[0]][finishCoordinates[1]] = squareOfStart;

        setPieces(nextPieces);
        setSelectionState("selectPiece");
        setPieceSelected(null);
        setPossibilitiesOfMoves([]);
    }
        
    //function pour identifier une pièce et crée l'object quand une pièce est selectionnée
    function identifyPiece(pieceNotation, row, column){
        pieceNotation.split();
        
        let tableName = {
            p: "pawn",
            h: "horse",
            b: "bishop",
            c: "castle",
            q: "queen",
            k: "king"
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
    
    return squares;
}
     
//function caractérisant une case
function Square({position, color, onSquareClick, row, column,identifyPiece, pieceOnSquare, pieceSelected, possibilitiesOfMoves}){

    let squareAspect;

    if (pieceSelected !== null && pieceSelected.coordinates === row + '-' + column) {
        squareAspect = "square " + color + " square--selected";
    }else if (possibilitiesOfMoves.includes(row + '-' + column)) {
        squareAspect = "square " + color + " square--possibility";
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

export default Board;