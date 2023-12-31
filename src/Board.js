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
        setBlackKingState,
        finishTurn,
        teamTurn,
        setDisplayPromotion,
        displayPromotion,
        previousMove,
        setPreviousMove,
        highlight
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
                    previousMove={previousMove}
                    highlight={highlight}
                ></Square>
            );
        }
    }
    
    //rendu du jeu (avec les cartes de promotions s'il y a une promotion à faire et les cases du plateau avec les pièces s'il y en a une dessus)
    return (
        <>
            {displayPromotion && <PromotionCards />}
            <ul className="game__el board">
               {squares}
            </ul>
        </>
    );



    //au clique d'une case
    function clickOnSquare(row, column){
        let piece = pieces[row][column];
        
        if (selectionState === "selectPiece" && piece !== '  ') {
            //au début du tour pour pouvoir selectionner une pièce que l'on veut déplacer (fait rien si clique sur une case sans pièce)
            let pieceHere = identifyPiece(piece, row, column);
            if (pieceHere.side === teamTurn) {
                setPieceToMove(pieceHere);
            }
            
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
    function setPieceToMove(piece, action = "update", latestPieces = structuredClone(pieces), lastestWhiteAttack = structuredClone(whiteAttack), latestBlackAttack = structuredClone(blackAttack), latestWhiteKingState = structuredClone(whiteKingState), latestBlackKingState = structuredClone(blackKingState)){
        //tableau des possibilités qui ne mettent pas son propre roi en échec
        let kingSafeMoves = [];
        //tableau de toutes les possibilités que la pièce peut faire normalement
        let allPossibleMoves = ChessMoves(piece, latestPieces, identifyPiece, whiteCastlingPossibility, blackCastlingPossibility, lastestWhiteAttack, latestBlackAttack, latestWhiteKingState, latestBlackKingState, previousMove);

        //boucle pour essayer toutes les possibilités de mouvements de la pièce et vérifier lesquelles ne mettent pas la pièce en échec
        for (let i = 0; i < allPossibleMoves.length; i++) {
            if (piece.name === "king") {
                //pour les mouvements du roi, prenant déjà en comptre le faite qu'il ne doit pas être en échec et surtout, permet de roque
                // dans certaines situations car le système de prédiciton pour voir si le roi est en échec ou pas ne fonctionne pas avec le roque 
                //mais les conditions que celui-ci impose fait que de toutes façon, si l'on peut roque, c'est que le roi n'est pas en échec en fin de roque
                kingSafeMoves.push(allPossibleMoves[i]);
            }else{
                let isKingSafe = goToDestination(allPossibleMoves[i], "test", piece, latestPieces, lastestWhiteAttack, latestBlackAttack, latestWhiteKingState, latestBlackKingState);
                if (isKingSafe) {
                    kingSafeMoves.push(allPossibleMoves[i]);
                }
            }
        }

        if (action === "update") {
            setPieceSelected(piece);
            setPossibilitiesOfMoves(kingSafeMoves);
            setSelectionState("selectMove");
        }else{
            if (kingSafeMoves.length === 0) {
                return false;
            }else{
                return true;
            }
        }
    }




    //function appliquant le déplacement choisi de la pièce
    function goToDestination(destination, action = "update", pieceForTest = {}, latestPieces = structuredClone(pieces), lastestWhiteAttack = structuredClone(whiteAttack), latestBlackAttack = structuredClone(blackAttack), latestWhiteKingState = structuredClone(whiteKingState), latestBlackKingState = structuredClone(blackKingState)){
        let pieceToProcess;
        if (action === "update") {
            pieceToProcess = pieceSelected;
        }else if (action === "test") {
            pieceToProcess = pieceForTest;
        }

        let startingCoordinates = pieceToProcess.coordinates.split('-');
        let finishCoordinates = destination.split('-');

        //arrête la possibilité de roque si le roi s'est déplacé
        if (pieceToProcess.name === "king") {
            if (pieceToProcess.side === "white") {
                latestWhiteKingState.coordinates = destination;

                if (action === "update") {
                    setWhiteCastlingPossibility({
                        left: false,
                        right: false
                    });
                    setWhiteKingState(latestWhiteKingState);
                }
            }else if(pieceToProcess.side === "black") {
                latestBlackKingState.coordinates = destination;

                if (action === "update") {
                    setBlackCastlingPossibility({
                        left: false,
                        right: false
                    });
                    setBlackKingState(latestBlackKingState);
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
        const nextPieces = latestPieces.slice();
        for (let i = 0; i < 8; i++) {
            nextPieces[i] = latestPieces[i].slice();
        }
        
        let pieceTaken;
        let squareOfStart = nextPieces[startingCoordinates[0]][startingCoordinates[1]];
        nextPieces[startingCoordinates[0]][startingCoordinates[1]] = "  ";
        if (nextPieces[finishCoordinates[0]][finishCoordinates[1]] !== "  ") {
            pieceTaken = identifyPiece(nextPieces[finishCoordinates[0]][finishCoordinates[1]], finishCoordinates[0], finishCoordinates[1]);
        }
        nextPieces[finishCoordinates[0]][finishCoordinates[1]] = squareOfStart;

        //pour réaliser un "en passant"
        if(pieceToProcess.name === "pawn"
            && (Number(finishCoordinates[1]) === Number(startingCoordinates[1]) + 1 || Number(finishCoordinates[1]) === Number(startingCoordinates[1]) - 1) && previousMove.length !== 0 
            && ((Number(previousMove[3].split('-')[0]) === 3 && previousMove[0] === "white" && previousMove[1] === "pawn" && pieceToProcess.side === "black" && Number(startingCoordinates[0]) === 3) 
            || (Number(previousMove[3].split('-')[0]) === 4 && previousMove[0] === "black" && previousMove[1] === "pawn" && pieceToProcess.side === "white" && Number(startingCoordinates[0]) === 4))
        ){
            nextPieces[previousMove[3].split('-')[0]][previousMove[3].split('-')[1]] = "  ";
        }


        if (action === "update") {
            //update du tableau de jeu et reset des paramètres de selection (pour pouvoir rechoisir une pièce)
            setPieces(nextPieces);
            setPossibilitiesOfMoves([]);
            setSelectionState("selectPiece");
            if (pieceToProcess.name === "pawn" && pieces[finishCoordinates[0]][finishCoordinates[1]] === "  " 
                && (Number(finishCoordinates[1]) === Number(startingCoordinates[1]) + 1 || Number(finishCoordinates[1]) === Number(startingCoordinates[1]) - 1) && previousMove.length !== 0 
                && ((Number(previousMove[3].split('-')[0]) === 3 && previousMove[0] === "white" && previousMove[1] === "pawn" && pieceToProcess.side === "black" && Number(startingCoordinates[0]) === 3) 
                || (Number(previousMove[3].split('-')[0]) === 4 && previousMove[0] === "black" && previousMove[1] === "pawn" && pieceToProcess.side === "white" && Number(startingCoordinates[0]) === 4))
            ){
                setPreviousMove([pieceToProcess.side, pieceToProcess.name, pieceToProcess.coordinates, destination, "en passant", previousMove]);
            }else if(pieceTaken){
                setPreviousMove([pieceToProcess.side, pieceToProcess.name, pieceToProcess.coordinates, destination, "took", pieceTaken]);
            }else{
                setPreviousMove([pieceToProcess.side, pieceToProcess.name, pieceToProcess.coordinates, destination]);
            }
            

            //si un pion arrive sur une case du coté adverse, il est alors promu; sinon, refresh la pièce selectionnée et les tableaux d'attaques
            if (pieceToProcess.name === "pawn" && ((pieceToProcess.side === "white" && Number(finishCoordinates[0]) === 7) || (pieceToProcess.side === "black" && Number(finishCoordinates[0]) === 0))) {
                //permet d'afficher les cartes de promotions
                setDisplayPromotion(true);

                //crée un copie de la pièce selectionnée et lui donne les nouvelles coordonnées pour pouvoir les passer correctement lors de la promotion
                let newPiece = structuredClone(pieceToProcess);
                newPiece.coordinates = finishCoordinates[0] + "-" + finishCoordinates[1];
                setPieceSelected(newPiece);
            }else{
                setPieceSelected(null);
                generateAttackAndCheck(nextPieces, latestWhiteKingState, latestBlackKingState);
            }
        }else if(action === "test"){
            return generateAttackAndCheck(nextPieces, latestWhiteKingState, latestBlackKingState, "test", pieceToProcess.side);
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


        //clone les infos sur les rois pour pouvoir les exporter plus facilement après s'ils doivent être modifier
        let copyWhiteKingState = structuredClone(whiteKingState);
        let copyBlackKingState = structuredClone(blackKingState);

        //arrête la possibilité de roque après l'avoir effectuer
        if (pieceSelected.side === "white") {
            copyWhiteKingState.coordinates = kingStartingCoordinates[0] + '-' + kingEndCoordinateX;
            setWhiteCastlingPossibility({
                left: false,
                right: false
            });
            setWhiteKingState(copyWhiteKingState);
            
        }else if(pieceSelected.side === "black") {
            copyBlackKingState.coordinates = kingStartingCoordinates[0] + '-' + kingEndCoordinateX;;
            setBlackCastlingPossibility({
                left: false,
                right: false
            });
            setBlackKingState(copyBlackKingState);
        }

        setPieces(nextPieces);
        setSelectionState("selectPiece");
        setPieceSelected(null);
        setPossibilitiesOfMoves([]);
        generateAttackAndCheck(nextPieces, copyWhiteKingState, copyBlackKingState);
        setPreviousMove([pieceSelected.side, pieceSelected.name, pieceSelected.coordinates, kingStartingCoordinates[0] + '-' + kingEndCoordinateX, "castling", rookStartingCoordinates]);
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
    function generateAttackAndCheck(nextPieces, newWhiteKingState, newBlackKingState, action = "update", teamForTest = "none"){
        
        //copie de l'état du roi de chaque équipe
        let copyWhiteKingState = newWhiteKingState;
        let copyBlackKingState = newBlackKingState;

        //copie du tableau des cases attaqués par chaque camp
        const nextWhiteAttack = [
            [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
            [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
            [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
            [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
            [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
            [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
            [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
            [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ']
        ];

        const nextBlackAttack = [
            [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
            [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
            [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
            [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
            [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
            [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
            [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
            [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ']
        ];

        //place une croix dans la case du tableau à chaque endroit où une case est attaquée
        for (let h = 0; h < 2; h++) {
            for (let i = 0; i < 8; i++) {
                for (let j = 0; j < 8; j++) {
                    //condition pour faire les rois à la fin, pour être sur qu'il n'y ai pas de problème (même si ça ne devrait pas être le cas)
                    if ((nextPieces[i][j] !== "  " && h === 0) || ((nextPieces[i][j] === "bk" || nextPieces[i][j] === "wk") && h === 1)) {
                        //identifie la pièce et ses possibilités d'attaques
                        let pieceThere = identifyPiece(nextPieces[i][j], i, j);
                        let attackPossibility = ChessMoves(pieceThere, nextPieces, identifyPiece, whiteCastlingPossibility, blackCastlingPossibility, nextWhiteAttack, nextBlackAttack, copyWhiteKingState, copyBlackKingState, previousMove, "onlyAttack");
    
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
        }
        

        let kingToLook;
        let attackToLook;
        let kingNotationToLook;
        let teamToLook;
        for (let i = 0; i < 2; i++) {
            if (i === 0) {
                kingToLook = copyWhiteKingState;
                attackToLook = nextBlackAttack;
                kingNotationToLook = "wk";
                teamToLook = "white";
            }else{
                kingToLook = copyBlackKingState;
                attackToLook = nextWhiteAttack;
                kingNotationToLook = "bk";
                teamToLook = "black";
            }
            

            //check si les rois sont en échec, en échec et mat ou autres
            if (ChessMoves(kingToLook, nextPieces, identifyPiece, whiteCastlingPossibility, blackCastlingPossibility, nextWhiteAttack, nextBlackAttack, copyWhiteKingState, copyBlackKingState, previousMove).length !== 0) {
                //les cas où le roi peut se déplacer
                if (attackToLook[kingToLook.coordinates.split('-')[0]][kingToLook.coordinates.split('-')[1]] === "x") {
                    //les cas où le roi est en échec
                    kingToLook.state = "check";
                }else{
                    //les cas où le roi n'est pas en échec
                    kingToLook.state = "free";
    
                    if (action === "update") {
                        let foundPiecefromTeam = false;
    
                        for (let i = 0; i < 8; i++) {
                            for (let j = 0; j < 8; j++) {
                                if (nextPieces[i][j] !== "  " && nextPieces[i][j] !== "bk" && nextPieces[i][j] !== "wk") {
                                    foundPiecefromTeam = true;
                                    break;
                                }
                            }
                        }
                        if(foundPiecefromTeam === false){
                            kingToLook.state = "stalemate";
                        }else{
                            kingToLook.state = "free";
                        }
                    }
                }
            }else{
                //les cas où le roi ne peut pas se déplacer
                if (attackToLook[kingToLook.coordinates.split('-')[0]][kingToLook.coordinates.split('-')[1]] === "x") {
                    //les cas où le roi est en échec
                    kingToLook.state = "check";
    
                    if (action === "update") {
                        let foundPiecefromTeam = false;
    
                        for (let i = 0; i < 8; i++) {
                            for (let j = 0; j < 8; j++) {
                                if (nextPieces[i][j] !== "  ") {
                                    let pieceThere = identifyPiece(nextPieces[i][j], i, j);
                                    if (pieceThere.side === teamToLook) {
                                        if (setPieceToMove(pieceThere, "test", nextPieces, nextWhiteAttack, nextBlackAttack, copyWhiteKingState, copyBlackKingState)) {
                                            foundPiecefromTeam = true;
                                            break;
                                        }
                                    }
                                }
                            }
                            if (foundPiecefromTeam === true) {
                                break;
                            }
                        }
                        if(foundPiecefromTeam === false){
                            kingToLook.state = "checkmate";
                        }else{
                            kingToLook.state = "check";
                        }
                    }
                }else{
                    //les cas où le roi n'est pas en échec
                    kingToLook.state = "free";
    
                    if (action === "update") {
                        let foundPiecefromTeam = false;
    
                        for (let i = 0; i < 8; i++) {
                            for (let j = 0; j < 8; j++) {
                                if (nextPieces[i][j] !== "  " && nextPieces[i][j] !== kingNotationToLook) {
                                    let pieceThere = identifyPiece(nextPieces[i][j], i, j);
                                    if (pieceThere.side === teamToLook) {
                                        if (setPieceToMove(pieceThere, "test", nextPieces, nextWhiteAttack, nextBlackAttack, copyWhiteKingState, copyBlackKingState)) {
                                            foundPiecefromTeam = true;
                                            break;
                                        }
                                    }
                                }
                            }
                            if (foundPiecefromTeam === true) {
                                break;
                            }
                        }
                        if(foundPiecefromTeam === false){
                            kingToLook.state = "stalemate";
                        }else{
                            kingToLook.state = "free";
                        }
                    }
                }
            }
        }


        if (action === "update") {
            //set les nouveaux tableaux d'attaques pour les deux équipes
            setWhiteAttack(nextWhiteAttack);
            setBlackAttack(nextBlackAttack);

            //set les nouveaux tableaux d'attaques pour les deux équipes
            setWhiteKingState(copyWhiteKingState);
            setBlackKingState(copyBlackKingState);

            finishTurn(copyWhiteKingState, copyBlackKingState);
        }else if(action === "test"){
            if ((teamForTest === "white" && copyWhiteKingState.state === "check") || 
                (teamForTest === "black" && copyBlackKingState.state === "check")) {
                return false;
            }else{
                return true;
            }
        }
        
    }


    //function pour promouvoir une pièce
    function promote(promotion){
        //change dans le tableau des pièces la notation à l'endroit de la promotion
        let team = (pieceSelected.side === "black") ? "b" : "w";
        pieces[pieceSelected.coordinates.split('-')[0]][pieceSelected.coordinates.split('-')[1]] = team + promotion;
        
        //activation de fin de tour et retire les cartes de promotion
        generateAttackAndCheck(pieces, whiteKingState, blackKingState);
        setPieceSelected(null);
        setDisplayPromotion(false);
    }

    //function des cartes de promotions
    function PromotionCards(){
        return (
            <div className='cards'>
                <p className={`cards__title ${pieceSelected.side}`}>Choose the promotion</p>
                <ul className='cards__list'>
                    <li className={`card piece queen ${pieceSelected.side}`} key="queen" onClick={() => promote("q")}></li>
                    <li className={`card piece rook ${pieceSelected.side}`} key="rook" onClick={() => promote("r")}></li>
                    <li className={`card piece bishop ${pieceSelected.side}`} key="bishop" onClick={() => promote("b")}></li>
                    <li className={`card piece knight ${pieceSelected.side}`} key="knight" onClick={() => promote("n")}></li>
                </ul>
            </div>
        );
    }
}
     



//function caractérisant une case
function Square({position, color, onSquareClick, row, column,identifyPiece, pieceOnSquare, pieceSelected, possibilitiesOfMoves, whiteKingState, blackKingState, previousMove, highlight}){

    let effectOnSquare = "square--noEffect";

    if (pieceSelected && pieceSelected.coordinates === row + '-' + column) {
        effectOnSquare = "square--selected";
    }else if (possibilitiesOfMoves.includes(row + '-' + column)) {
        effectOnSquare = "square--possibility";
    }else if (previousMove[2] === row + '-' + column && highlight) {
        effectOnSquare = "square--previousMoveOrigin";
    }else if (previousMove[3] === row + '-' + column && highlight) {
        effectOnSquare = "square--previousMoveDestination";
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