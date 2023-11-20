import { useState } from "react";
import ChessMoves from './utils/ChessMoves';

//pour former le plateau et ses intéractions
function Board(props) {
    //réattribut les props définis dans Game
    let {pieces, setPieces, whiteCastlingPossibility, setWhiteCastlingPossibility, blackCastlingPossibility, setBlackCastlingPossibility} = props;
    
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
            if (piece === '  ') {
                //si clique sur une case sans pièce (bouge la pièce)
                if (possibilitiesOfMoves.includes(row + '-' + column)) {
                    //vérifie que cette case est bien dans les déplacements possibles
                    goToDestination(row + '-' + column);
                }

            }else{
                //si clique sur une case avec pièce
                let pieceHere = identifyPiece(piece, row, column);

                if (pieceHere.coordinates === pieceSelected.coordinates){
                    //si clique sur la même case (déselectionne)
                    deselectPiece();

                }else if(pieceSelected.name === "king" && pieceHere.name === "rook" && pieceHere.side === pieceSelected.side){
                    //si clique sur une tour après avoir selectionner le roi pour roque
                    if ((Number(pieceSelected.coordinates.split('-')[1]) > Number(pieceHere.coordinates.split('-')[1]) 
                            && ((whiteCastlingPossibility.left && pieceSelected.side === "white") 
                            || (blackCastlingPossibility.left && pieceSelected.side === "black"))) || 
                        (Number(pieceSelected.coordinates.split('-')[1]) < Number(pieceHere.coordinates.split('-')[1]) 
                            && ((whiteCastlingPossibility.right && pieceSelected.side === "white") 
                            || (blackCastlingPossibility.right && pieceSelected.side === "black")))
                    ){
                            castling(pieceHere);
                    }

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
        setPossibilitiesOfMoves(ChessMoves(piece, pieces, identifyPiece, whiteCastlingPossibility, blackCastlingPossibility));
    }

    //function appliquant le déplacement choisi de la pièce
    function goToDestination(destination){
        let startingCoordinates = pieceSelected.coordinates.split('-');
        let finishCoordinates = destination.split('-');

        //arrête la possibilité de roque si le roi s'est déplacé
        if (pieceSelected.name === "king") {
            if (pieceSelected.side === "white") {
                setWhiteCastlingPossibility({
                    left: false,
                    right: false
                });
            }else if(pieceSelected.side === "black") {
                setBlackCastlingPossibility({
                    left: false,
                    right: false
                });
            }
        }

        //arrête la possibilité de roque du coté de la tour qui est déplacée
        if (pieceSelected.name === "rook") {
            if (pieceSelected.side === "white") {
                //crée une copie pour ne pas reset soit le paramètre left soit right de l'Object
                let copyWhiteCastlingPossibility = whiteCastlingPossibility;

                //si c'est la tour de gauche qui a bougée
                if (pieceSelected.coordinates === "0-0") {
                    copyWhiteCastlingPossibility.left = false;
                    setWhiteCastlingPossibility(copyWhiteCastlingPossibility);

                //si c'est la tour de droite qui a bougée
                }else if (pieceSelected.coordinates === "0-7") {
                    copyWhiteCastlingPossibility.right = false;
                    setWhiteCastlingPossibility(copyWhiteCastlingPossibility);

                }
            }else if(pieceSelected.side === "black") {
                //crée une copie pour ne pas reset soit le paramètre left soit right de l'Object
                let copyBlackCastlingPossibility = blackCastlingPossibility;

                //si c'est la tour de gauche qui a bougée
                if (pieceSelected.coordinates === "7-0") {
                    copyBlackCastlingPossibility.left = false;
                    setWhiteCastlingPossibility(copyBlackCastlingPossibility);

                //si c'est la tour de droite qui a bougée
                }else if (pieceSelected.coordinates === "7-7") {
                    copyBlackCastlingPossibility.right = false;
                    setWhiteCastlingPossibility(copyBlackCastlingPossibility);

                }
            }
        }

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

    //function appliquant le déplacement choisi de la pièce
    function castling(rook){
        let kingStartingCoordinates = pieceSelected.coordinates.split('-');
        let rookStartingCoordinates = rook.coordinates.split('-');

        let kingEndCoordinateX;
        let rookEndCoordinateX;
        //le roi est toujours déplacé de deux dans la direction de la tour, et la tour passe de l'autre coté du roi
        if (kingStartingCoordinates[1] > rookStartingCoordinates[1]) {
            kingEndCoordinateX = Number(kingStartingCoordinates[1]) - 2;
            rookEndCoordinateX = kingEndCoordinateX + 1;
        }else{
            kingEndCoordinateX = Number(kingStartingCoordinates[1]) + 2;
            rookEndCoordinateX = kingEndCoordinateX - 1;
        }
        

        const nextPieces = pieces.slice();
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                nextPieces[i][j].slice();
            }
        }

        let kingSquareOfStart = nextPieces[kingStartingCoordinates[0]][kingStartingCoordinates[1]];
        let rookSquareOfStart = nextPieces[rookStartingCoordinates[0]][rookStartingCoordinates[1]];
        nextPieces[kingStartingCoordinates[0]][kingStartingCoordinates[1]] = "  ";
        nextPieces[kingStartingCoordinates[0]][kingEndCoordinateX] = kingSquareOfStart;
        nextPieces[rookStartingCoordinates[0]][rookStartingCoordinates[1]] = "  ";
        nextPieces[rookStartingCoordinates[0]][rookEndCoordinateX] = rookSquareOfStart;

        //arrête la possibilité de roque après l'avoir effectuer
        if (pieceSelected.side === "white") {
            setWhiteCastlingPossibility({
                left: false,
                right: false
            });
        }else if(pieceSelected.side === "black") {
            setBlackCastlingPossibility({
                left: false,
                right: false
            });
        }

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
            n: "knight",
            b: "bishop",
            r: "rook",
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

    if (pieceSelected && pieceSelected.coordinates === row + '-' + column) {
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