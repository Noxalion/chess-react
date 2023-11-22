import { useState } from "react";
import ChessMoves from './utils/ChessMoves';

//pour former le plateau et ses intéractions
function Board(props) {
    //réattribut les props définis dans Game
    let {
        pieces, 
        setPieces, 
        whiteCastlingPossibility, 
        setWhiteCastlingPossibility, 
        blackCastlingPossibility, 
        setBlackCastlingPossibility, 
        whiteAttack,
        setWhiteAttack,
        blackAttack,
        setBlackAttack,
        whiteKingState,
        setWhiteKingState,
        blackKingState,
        setBlackKingState
    } = props;
    
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
                    whiteKingState={whiteKingState}
                    blackKingState={blackKingState}
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

                }else if(pieceSelected.name === "king" && pieceHere.name === "rook" && pieceHere.side === pieceSelected.side && possibilitiesOfMoves.includes(row + '-' + column)){
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
        console.log(whiteAttack);

        //tableau des possibilités qui ne mettent pas son propre roi en échec
        let kingSafeMoves = [];
        //tableau de toutes les possibilités que la pièce peut faire normalement
        let allPossibleMoves = ChessMoves(piece, pieces, identifyPiece, whiteCastlingPossibility, blackCastlingPossibility, whiteAttack, blackAttack, whiteKingState, blackKingState);

        //boucle pour essayer toutes les possibilités de mouvements de la pièce et vérifier lesquelles ne mettent pas la pièce en échec
        for (let i = 0; i < allPossibleMoves.length; i++) {
            console.log(allPossibleMoves[i]);
            console.log(goToDestination(allPossibleMoves[i], "test", piece));
            let isKingSafe = goToDestination(allPossibleMoves[i], "test", piece);
            if (isKingSafe) {
                kingSafeMoves.push(allPossibleMoves[i]);
            }
        }

        setPossibilitiesOfMoves(kingSafeMoves);
        setSelectionState("selectMove");
    }




    //function appliquant le déplacement choisi de la pièce
    function goToDestination(destination, action = "update", pieceForTest = {}){
        let pieceToProcess;
        if (action === "update") {
            pieceToProcess = pieceSelected;
        }else if (action === "test") {
            pieceToProcess = pieceForTest;
        }

        let startingCoordinates = pieceToProcess.coordinates.split('-');
        let finishCoordinates = destination.split('-');

        //clone les infos sur les rois pour pouvoir les exporter plus facilement après s'ils doivent être modifier
        let copyWhiteKingState = structuredClone(whiteKingState);
        let copyBlackKingState = structuredClone(blackKingState);

        //arrête la possibilité de roque si le roi s'est déplacé
        if (pieceToProcess.name === "king") {
            if (pieceToProcess.side === "white") {
                copyWhiteKingState.coordinates = destination;

                if (action === "update") {
                    setWhiteCastlingPossibility({
                        left: false,
                        right: false
                    });
                    setWhiteKingState(copyWhiteKingState);
                }
            }else if(pieceToProcess.side === "black") {
                copyBlackKingState.coordinates = destination;

                if (action === "update") {
                    setBlackCastlingPossibility({
                        left: false,
                        right: false
                    });
                    setWhiteKingState(copyBlackKingState);
                }
            }
        }

        if (action === "update") {
            //arrête la possibilité de roque du coté de la tour qui est déplacée
            if (pieceToProcess.name === "rook") {
                if (pieceToProcess.side === "white") {
                    //crée une copie pour ne pas reset soit le paramètre left soit right de l'Object
                    let copyWhiteCastlingPossibility = structuredClone(whiteCastlingPossibility);
    
                    //si c'est la tour de gauche qui a bougée
                    if (pieceToProcess.coordinates === "0-0") {
                        copyWhiteCastlingPossibility.left = false;
                        setWhiteCastlingPossibility(copyWhiteCastlingPossibility);
    
                    //si c'est la tour de droite qui a bougée
                    }else if (pieceToProcess.coordinates === "0-7") {
                        copyWhiteCastlingPossibility.right = false;
                        setWhiteCastlingPossibility(copyWhiteCastlingPossibility);
    
                    }
                }else if(pieceToProcess.side === "black") {
                    //crée une copie pour ne pas reset soit le paramètre left soit right de l'Object
                    let copyBlackCastlingPossibility = structuredClone(blackCastlingPossibility);
    
                    //si c'est la tour de gauche qui a bougée
                    if (pieceToProcess.coordinates === "7-0") {
                        copyBlackCastlingPossibility.left = false;
                        setWhiteCastlingPossibility(copyBlackCastlingPossibility);
    
                    //si c'est la tour de droite qui a bougée
                    }else if (pieceToProcess.coordinates === "7-7") {
                        copyBlackCastlingPossibility.right = false;
                        setWhiteCastlingPossibility(copyBlackCastlingPossibility);
    
                    }
                }
            }
        }
        

        //copie du tableau de jeu et update de la copie selon l'action du joueur
        const nextPieces = pieces.slice();
        for (let i = 0; i < 8; i++) {
            nextPieces[i] = pieces[i].slice();
        }
        

        let squareOfStart = nextPieces[startingCoordinates[0]][startingCoordinates[1]];
        nextPieces[startingCoordinates[0]][startingCoordinates[1]] = "  ";
        nextPieces[finishCoordinates[0]][finishCoordinates[1]] = squareOfStart;

        if (action === "update") {
            //update du tableau de jeu et reset des paramètres de selection (pour pouvoir rechoisir une pièce)
            setPieces(nextPieces);
            setSelectionState("selectPiece");
            setPieceSelected(null);
            setPossibilitiesOfMoves([]);
            generateNewAttack(nextPieces, copyWhiteKingState, copyBlackKingState);

        }else if(action === "test"){
            return generateNewAttack(nextPieces, copyWhiteKingState, copyBlackKingState, "test", pieceToProcess.side);
        }
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
            nextPieces[i] = pieces[i].slice();
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

            let copyWhiteKingState = structuredClone(whiteKingState);
            copyWhiteKingState.coordinates = kingStartingCoordinates[0] + '-' + kingEndCoordinateX;
            setWhiteKingState(copyWhiteKingState);
        }else if(pieceSelected.side === "black") {
            setBlackCastlingPossibility({
                left: false,
                right: false
            });

            let copyBlackKingState = structuredClone(blackKingState);
            copyBlackKingState.coordinates = kingStartingCoordinates[0] + '-' + kingEndCoordinateX;;
            setWhiteKingState(copyBlackKingState);
        }

        setPieces(nextPieces);
        setSelectionState("selectPiece");
        setPieceSelected(null);
        setPossibilitiesOfMoves([]);
        generateNewAttack(nextPieces);
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




    //function pour update les tableaux d'attaques de chaque équipe
    function generateNewAttack(nextPieces, newWhiteKingState, newBlackKingState, action = "update", teamForTest = "none"){
        
        //copie de l'état du roi de chaque équipe
        let copyWhiteKingState = newWhiteKingState;
        let copyBlackKingState = newBlackKingState;

        //copie du tableau des cases attaqués par chaque camp
        const nextWhiteAttack = whiteAttack.slice();
        const nextBlackAttack = blackAttack.slice();
        for (let i = 0; i < 8; i++) {
            nextWhiteAttack[i] = whiteAttack[i].slice();
            nextBlackAttack[i] = blackAttack[i].slice();
        }

        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                //reset les copies des tableaux pour être sûr de ne pas avoir une case attaquée alors que ce n'est pas le cas
                nextWhiteAttack[i][j] = " ";
                nextBlackAttack[i][j] = " ";
            }
        }

        //place une croix dans la case du tableau à chaque endroit où une case est attaquée
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                if (nextPieces[i][j] !== "  ") {
                    //identifie la pièce et ses possibilités d'attaques
                    let pieceThere = identifyPiece(nextPieces[i][j], i, j);
                    let attackPossibility = ChessMoves(pieceThere, nextPieces, identifyPiece, whiteCastlingPossibility, blackCastlingPossibility, nextWhiteAttack, nextBlackAttack, copyWhiteKingState, copyBlackKingState, "onlyAttack");

                    //ajoute les possibilités d'attaques au tableau de l'équipe de la pièce
                    if (pieceThere.side === "white") {
                        for (let i = 0; i < attackPossibility.length; i++) {
                            let attackRow = Number(attackPossibility[i].split('-')[0]);
                            let attackColumn = Number(attackPossibility[i].split('-')[1]);

                            nextWhiteAttack[attackRow][attackColumn] = "x";
                        }
                    }else if (pieceThere.side === "black") {
                        for (let i = 0; i < attackPossibility.length; i++) {
                            let attackRow = Number(attackPossibility[i].split('-')[0]);
                            let attackColumn = Number(attackPossibility[i].split('-')[1]);

                            nextBlackAttack[attackRow][attackColumn] = "x";
                        }
                    }
                }                
            }
        }
        

        //check si les roi sont en échec, en échec et mat ou autres
        if (ChessMoves(copyWhiteKingState, nextPieces, identifyPiece, whiteCastlingPossibility, blackCastlingPossibility, nextWhiteAttack, nextBlackAttack, copyWhiteKingState, copyBlackKingState).length !== 0) {
            //les cas où le roi peut se déplacer
            if (nextBlackAttack[copyWhiteKingState.coordinates.split('-')[0]][copyWhiteKingState.coordinates.split('-')[1]] === "x") {
                //les cas où le roi est en échec
                copyWhiteKingState.state = "check";
            }else{
                //les cas où le roi n'est pas en échec
                copyWhiteKingState.state = "free";
            }
        }else{
            //les cas où le roi ne peut pas se déplacer
            if (nextBlackAttack[copyWhiteKingState.coordinates.split('-')[0]][copyWhiteKingState.coordinates.split('-')[1]] === "x") {
                //les cas où le roi est en échec
                copyWhiteKingState.state = "check";
            }else{
                //les cas où le roi n'est pas en échec
                copyWhiteKingState.state = "free";
            }
        }

        if (ChessMoves(copyBlackKingState, nextPieces, identifyPiece, whiteCastlingPossibility, blackCastlingPossibility, nextWhiteAttack, nextBlackAttack, copyWhiteKingState, copyBlackKingState).length !== 0) {
            //les cas où le roi peut se déplacer
            if (nextWhiteAttack[copyBlackKingState.coordinates.split('-')[0]][copyBlackKingState.coordinates.split('-')[1]] === "x") {
                //les cas où le roi est en échec
                copyBlackKingState.state = "check";
            }else{
                //les cas où le roi n'est pas en échec
                copyBlackKingState.state = "free";
            }
        }else{
            //les cas où le roi ne peut pas se déplacer
            if (nextWhiteAttack[copyBlackKingState.coordinates.split('-')[0]][copyBlackKingState.coordinates.split('-')[1]] === "x") {
                //les cas où le roi est en échec
                copyBlackKingState.state = "check";
            }else{
                //les cas où le roi n'est pas en échec
                copyBlackKingState.state = "free";
            }
        }

        if (action === "update") {
            //set les nouveaux tableaux d'attaques pour les deux équipes
            setWhiteAttack(nextWhiteAttack);
            setBlackAttack(nextBlackAttack);

            //set les nouveaux tableaux d'attaques pour les deux équipes
            setWhiteKingState(copyWhiteKingState);
            setBlackKingState(copyBlackKingState);
        }else if(action === "test"){
            if ((teamForTest === "white" && (copyWhiteKingState.state === "check" || copyWhiteKingState.state === "checkmate")) || 
                (teamForTest === "black" && (copyBlackKingState.state === "check" || copyBlackKingState.state === "checkmate"))) {
                return false;
            }else{
                return true;
            }
        }
        
    }
    
    return squares;
}
     



//function caractérisant une case
function Square({position, color, onSquareClick, row, column,identifyPiece, pieceOnSquare, pieceSelected, possibilitiesOfMoves, whiteKingState, blackKingState}){

    let effectOnSquare = "square--noEffect";

    if (pieceSelected && pieceSelected.coordinates === row + '-' + column) {
        effectOnSquare = "square--selected";
    }else if (possibilitiesOfMoves.includes(row + '-' + column)) {
        effectOnSquare = "square--possibility";
    }else if((whiteKingState.state === "check" && whiteKingState.coordinates === row + '-' + column) || (blackKingState.state === "check" && blackKingState.coordinates === row + '-' + column)){
        effectOnSquare = "square--check";
    }else if((whiteKingState.state === "checkmate" && whiteKingState.coordinates === row + '-' + column) || (blackKingState.state === "checkmate" && blackKingState.coordinates === row + '-' + column)){
        effectOnSquare = "square--checkmate";
    }else if((whiteKingState.state === "stalemate" && whiteKingState.coordinates === row + '-' + column) || (blackKingState.state === "stalemate" && blackKingState.coordinates === row + '-' + column)){
        effectOnSquare = "square--stalemate";
    }

    let squareAspect = `square ${color} ${effectOnSquare}`;
    
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