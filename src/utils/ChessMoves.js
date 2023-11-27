function ChessMoves(piece, pieces,identifyPiece, whiteCastlingPossibility, blackCastlingPossibility, whiteAttack, blackAttack, whiteKingState, blackKingState, previousMove, whatToCheck = "MoveAndAttack"){
    //le paramètre whatToCheck permet de savoir si l'on doit vérifier les mouvements ("MoveAndAttack" et donc renvois les mouvements et possibilités de prise) 
    //ou juste les possibilités d'attaques ("onlyAttack" et donc là où une pièce peut en prendre d'autres, doit donc spécifier aussi quand s'arrête sur une pièce alliée pour la protéger)

    switch (piece.name) {
        case "pawn":
            return pawnMoves();

        case "knight":
            return knightMoves();

        case "bishop":
            return bishopMoves();

        case "rook":
            return rookMoves();

        case "queen":
            //les mouvements de la reine sont la fusion entre les mouvements d'une tour et d'un fou donc réunissont les deux dans un seul tableau pour renvoyer tout ça correctement
            let diagonalMoves = bishopMoves();
            let straightMoves = rookMoves();
            return diagonalMoves.concat(straightMoves);

        case "king":
            return kingMoves();
    
        default:
            break;
    }


    //function pour voir les possibilités de déplacement d'un pion
    function pawnMoves(){
        let moves = [];
        let pieceRow = Number(piece.coordinates.split('-')[0]);
        let pieceColumn = Number(piece.coordinates.split('-')[1]);

        //ligne de départ d'un pion, dépend dans quel camp il est
        let pieceStartingRow;
        //facteur pour gérer la direction du pion, -1 pour aller vers le haut, 1 pour aller vers le bas
        let factorForUpAndDown;

        if (piece.side === "white") {
            pieceStartingRow = 1;
            factorForUpAndDown = 1;
        }else if(piece.side === "black"){
            pieceStartingRow = 6;
            factorForUpAndDown = -1;
        }

        //s'il n'a pas encore bougé, un pion peut avancer de deux cases 
        let maxRange = 1;
        if (pieceRow === pieceStartingRow) {
            maxRange = 2;
        }

        if (whatToCheck === "MoveAndAttack") {
            //la boucle pour gérer la portée du pion
            for (let i = 1; i < maxRange + 1; i++) {
                let additionFactor = (i * factorForUpAndDown);
                if (checkIfInBoard(pieceRow + additionFactor, pieceColumn)) {
                    if (pieces[pieceRow + additionFactor][pieceColumn] === "  ") {
                        let possibility = setPossibility(pieceRow, pieceColumn, additionFactor);
                        if (possibility) {
                            moves.push(possibility);
                        }
                    }else{
                        //entre ici si le pion rencontre un obstacle
                        break;
                    } 
                }    
            }
        }

        //pour voir si le pion peut prendre ou pas (prise en diagonale uniquement)
        for (let i = -1; i < 2; i+=2) {
            let additionFactor = (1 * factorForUpAndDown);
            let verticalToTake = pieceRow + additionFactor;
            let horizontalToTake = pieceColumn + i;
            if (checkIfInBoard(verticalToTake, horizontalToTake)) {
                if (pieces[verticalToTake][horizontalToTake] !== "  ") {
                    if (identifyPiece(pieces[verticalToTake][horizontalToTake], verticalToTake, horizontalToTake).side !== piece.side || whatToCheck === "onlyAttack") {
                        let possibility = setPossibility(pieceRow, pieceColumn, additionFactor, i);
                        if (possibility) {
                            moves.push(possibility);
                        }
                    }
                }else if(pieces[verticalToTake][horizontalToTake] === "  " && whatToCheck === "onlyAttack"){
                    let possibility = setPossibility(pieceRow, pieceColumn, additionFactor, i);
                    if (possibility) {
                        moves.push(possibility);
                    }
                }else if(pieces[pieceRow][horizontalToTake] !== "  " && (previousMove.length !== 0 && Number(previousMove[3].split('-')[1]) === horizontalToTake
                    && ((Number(previousMove[3].split('-')[0]) === 3 && Number(previousMove[2].split('-')[0]) === 1 && previousMove[0] === "white" && previousMove[1] === "pawn" && piece.side === "black" && pieceRow === 3) 
                    || (Number(previousMove[3].split('-')[0]) === 4 && Number(previousMove[2].split('-')[0]) === 6 && previousMove[0] === "black" && previousMove[1] === "pawn" && piece.side === "white" && pieceRow === 4)))
                ){
                    //ceci est pour pouvoir exécuter un "en passant"
                    let possibility = setPossibility(pieceRow, pieceColumn, additionFactor, i);
                    if (possibility) {
                        moves.push(possibility);
                    }
                }
            }
        }
        
        return moves;
    }




    //function pour voir les possibilités de déplacement d'un cheval
    function knightMoves(){
        let moves = [];
        let pieceRow = Number(piece.coordinates.split('-')[0]);
        let pieceColumn = Number(piece.coordinates.split('-')[1]);

        //signes des facteurs X et Y
        let signX = 1;
        let signY = 1;

        //valeurs des facteurs X et Y additionnés aux coordonnées pour voir les mouvements possibles
        let additionFactorX = 1;
        let additionFactorY = 2;

        //boucle pour créer les huit coordonnées possibles du cheval
        for (let g = 1; g < 9; g++) {
            //arrivé à la moitié de la boucle, inverse les valeurs à ajouter aux coordonnées
            if (g > 4) {
                additionFactorX = 2;
                additionFactorY = 1;
            }

            //permet de changer les signes des valeurs à ajouter sans que ce soit synchrone pour créer toutes les possibilités du cheval
            if (g % 2 === 0) {
                signX = -signX;
            }
            if (g % 2 === 1 && g > 1) {
                signY = -signY;
            }

            /*
            les précédents if renvoient ainsi:
            (1;2)
            (-1;2)
            (-1;-2)
            (1;-2)
            (2;1)
            (-2;1)
            (-2;-1)
            (2;-1)
            étant toujours les valeurs à additionner aux coordonnées du cheval pour créer ses mouvements
            */

            let verticalMove = pieceRow + (additionFactorX * signX);
            let horizontalMove = pieceColumn + (additionFactorY * signY);

            if (checkIfInBoard(verticalMove, horizontalMove)) {
                //pour si la case est vide
                if (pieces[verticalMove][horizontalMove] === "  ") {
                    let possibility = setPossibility(pieceRow, pieceColumn, (additionFactorX * signX), (additionFactorY * signY));
                    if (possibility) {
                        moves.push(possibility);
                    }
                //pour si la pièce sur la case n'est pas de la même équipe (pas vérifier en même temps que si la case est vide car risque de causer des problèmes en cherchant à indentifier des pièces sur des cases vides)
                }else if (identifyPiece(pieces[verticalMove][horizontalMove], verticalMove, horizontalMove).side !== piece.side || whatToCheck === "onlyAttack") {
                    let possibility = setPossibility(pieceRow, pieceColumn, (additionFactorX * signX), (additionFactorY * signY));
                    if (possibility) {
                        moves.push(possibility);
                    }
                }
            }
        }

        return moves;
    }




    //function pour voir les possibilités de déplacement d'un fou
    function bishopMoves(){
        let moves = [];
        let pieceRow = Number(piece.coordinates.split('-')[0]);
        let pieceColumn = Number(piece.coordinates.split('-')[1]);

        for (let i = 1; i < 5; i++) {
            //valeurs de l'incrémentation pour les déplacements en X et Y
            let incrementX = 1;
            let incrementY = 1;
    
            //valeurs des facteurs X et Y additionnés aux coordonnées pour voir les mouvements possibles
            let additionFactorX = 0;
            let additionFactorY = 0;

            //permet de changer les signes des valeurs à ajouter sans que ce soit synchrone pour créer toutes les possibilités du fou
            if (i % 2 === 0) {
                incrementX = -incrementX;
            }
            if (i % 3 === 1) {
                incrementY = -incrementY;
            }

            //créer un tableau des possibilités et les enregistres dans moves s'il y en a
            let tablePossibilities = wholeLineCheck(additionFactorX, additionFactorY, incrementX, incrementY, pieceRow, pieceColumn, whatToCheck);
            if (tablePossibilities) {
                for (let i = 0; i < tablePossibilities.length; i++) {
                    moves.push(tablePossibilities[i]);                    
                }
            }
        }

        return moves;
    }




    //function pour voir les possibilités de déplacement d'une tour
    function rookMoves(){
        let moves = [];
        let pieceRow = Number(piece.coordinates.split('-')[0]);
        let pieceColumn = Number(piece.coordinates.split('-')[1]);

        for (let i = 1; i < 5; i++) {
            //valeurs de l'incrémentation pour les déplacements en X et Y
            let incrementX;
            let incrementY;
            if (i > 2) {
                incrementX = 1;
                incrementY = 0;
            }else{
                incrementX = 0;
                incrementY = 1;
            }
            
            //valeurs des facteurs X et Y additionnés aux coordonnées pour voir les mouvements possibles
            let additionFactorX = 0;
            let additionFactorY = 0;

            //permet de changer les signes des valeurs à ajouter sans que ce soit synchrone pour créer toutes les possibilités de la tour
            if (i % 2 === 0) {
                incrementX = -incrementX;
            }
            if (i % 3 === 1) {
                incrementY = -incrementY;
            }

            //créer un tableau des possibilités et les enregistres dans moves s'il y en a
            let tablePossibilities = wholeLineCheck(additionFactorX, additionFactorY, incrementX, incrementY, pieceRow, pieceColumn, whatToCheck);
            if (tablePossibilities) {
                for (let i = 0; i < tablePossibilities.length; i++) {
                    moves.push(tablePossibilities[i]);                    
                }
            }
        }

        return moves;
    }




    //function pour checker une ligne (diagonale, verticale ou horizontale) dans une direction, enregistrant un tableau s'arrêtant au moment où il n'est plus possible pour la pièce de se déplacer dans cette direction
    function wholeLineCheck(additionFactorX, additionFactorY, incrementX, incrementY, pieceRow, pieceColumn, whatToCheck){
        //enregistre un tableau de possibilités
        let tablePossibilities = [];

        let verticalMove = pieceRow;
        let horizontalMove = pieceColumn;
        //boucle do while car on vérifie forcément une fois dans la direction et on s'arrête dès qu'on rencontre quelque chose
        do {
            //valeurs des facteurs X et Y additionnés aux coordonnées pour voir les mouvements possibles
            additionFactorX += incrementX;
            additionFactorY += incrementY;
        
            //valeurs des coordonnées X et Y des mouvements possibles
            verticalMove = pieceRow + additionFactorX;
            horizontalMove = pieceColumn + additionFactorY;
        
            if (checkIfInBoard(verticalMove, horizontalMove)) {
                //pour si la case est vide
                if (pieces[verticalMove][horizontalMove] === "  ") {
                    let possibility = setPossibility(pieceRow, pieceColumn, additionFactorX, additionFactorY);
                    if (possibility) {
                        tablePossibilities.push(possibility);
                    }
                    
                //pour si la pièce sur la case n'est pas de la même équipe (pas vérifier en même temps que si la case est vide car risque de causer des problèmes en cherchant à indentifier des pièces sur des cases vides)
                }else if (identifyPiece(pieces[verticalMove][horizontalMove], verticalMove, horizontalMove).side !== piece.side || whatToCheck === "onlyAttack") {
                    let possibility = setPossibility(pieceRow, pieceColumn, additionFactorX, additionFactorY);
                    if (possibility) {
                        tablePossibilities.push(possibility);
                    }
                }
            }
        } while (checkIfInBoard(verticalMove, horizontalMove) && (pieces[verticalMove][horizontalMove] === "  "
                || (whatToCheck === "onlyAttack" && ((pieces[verticalMove][horizontalMove] === "wk" && piece.side === "black") || (pieces[verticalMove][horizontalMove] === "bk" && piece.side === "white")))));

        return tablePossibilities;
    }




    //function pour voir les possibilités de déplacement d'un roi
    function kingMoves(){
        let moves = [];
        let pieceRow = Number(piece.coordinates.split('-')[0]);
        let pieceColumn = Number(piece.coordinates.split('-')[1]);

        for (let i = 1; i < 9; i++) {
            //valeurs des facteurs X et Y additionnés aux coordonnées pour voir les mouvements possibles
            let additionFactorX = 1;
            let additionFactorY = 0;
            
            //permet de changer la valeur des facteurs pour créer toutes les possibilités du roi
            if (i === 6 || i === 7) {
                additionFactorX = 0;
            }
            if (i > 1 && i < 8) {
                additionFactorY = 1;
            }

            //permet de changer les signes des valeurs à ajouter sans que ce soit synchrone pour créer toutes les possibilités du roi
            if (i % 2 === 1) {
                additionFactorY = -additionFactorY;
            }
            if (i > 3) {
                additionFactorX = -additionFactorX;
            }

            /*
            les précédents if renvoient ainsi:
            (1;0)
            (1;1)
            (1;-1)
            (-1;1)
            (-1;-1)
            (0;1)
            (0;-1)
            (-1;0)
            étant toujours les valeurs à additionner aux coordonnées du roi pour créer ses mouvements
            */

            let verticalMove = pieceRow + additionFactorX;
            let horizontalMove = pieceColumn + additionFactorY;

            if (checkIfInBoard(verticalMove, horizontalMove) && ((piece.side === "white" && blackAttack[verticalMove][horizontalMove] !== 'x') || (piece.side === "black" && whiteAttack[verticalMove][horizontalMove] !== 'x'))) {
                //pour si la case est vide
                if (pieces[verticalMove][horizontalMove] === "  ") {
                    let possibility = setPossibility(pieceRow, pieceColumn, additionFactorX, additionFactorY);
                    if (possibility) {
                        moves.push(possibility);
                    }
                //pour si la pièce sur la case n'est pas de la même équipe (pas vérifier en même temps que si la case est vide car risque de causer des problèmes en cherchant à indentifier des pièces sur des cases vides)
                }else if (identifyPiece(pieces[verticalMove][horizontalMove], verticalMove, horizontalMove).side !== piece.side || whatToCheck === "onlyAttack") {
                    let possibility = setPossibility(pieceRow, pieceColumn, additionFactorX, additionFactorY);
                    if (possibility) {
                        moves.push(possibility);
                    }
                }
            }
        }

        //code pour pouvoir roque
        //ne peut pas roque si le roi est en échec
        if (((piece.side === "white" && whiteKingState.state === "free") || (piece.side === "black" && blackKingState.state === "free")) && whatToCheck === "MoveAndAttack") {
            let horizontalMove = pieceColumn;
    
            //la boucle permet de check dans les deux directions, le signe permettant de changer le sens
            for (let i = -1; i < 2; i+=2) {
                let incrementToCheckCastling = 0;
    
                //si i est inférieur à zéro, alors doit vérifier s'il peut roque avec la tour de gauche; si i est supérieur à zéro, alors doit vérifier s'il peut roque avec la tour de droite
                if ((i < 0 && (
                            (
                                whiteCastlingPossibility.left && piece.side === "white" && blackAttack[pieceRow][Number(whiteKingState.coordinates.split('-')[1]) - 1] !== 'x' && blackAttack[pieceRow][Number(whiteKingState.coordinates.split('-')[1]) - 2] !== 'x'
                            ) || (
                                blackCastlingPossibility.left && piece.side === "black" && whiteAttack[pieceRow][Number(blackKingState.coordinates.split('-')[1]) - 1] !== 'x' && whiteAttack[pieceRow][Number(blackKingState.coordinates.split('-')[1]) - 2] !== 'x'    
                            )
                        )    
                    ) || (i > 0 && (
                            (
                                whiteCastlingPossibility.right && piece.side === "white" && blackAttack[pieceRow][Number(whiteKingState.coordinates.split('-')[1]) + 1] !== 'x' && blackAttack[pieceRow][Number(whiteKingState.coordinates.split('-')[1]) + 2] !== 'x'
                            ) || (
                                blackCastlingPossibility.right && piece.side === "black" && whiteAttack[pieceRow][Number(blackKingState.coordinates.split('-')[1]) + 1] !== 'x' && whiteAttack[pieceRow][Number(blackKingState.coordinates.split('-')[1]) + 2] !== 'x'
                            )
                        )
                    )) {
                    //check si la première pièce qu'il rencontre est bien une tour
                    do {
                        incrementToCheckCastling += i;
                    
                        horizontalMove = pieceColumn + incrementToCheckCastling;
                    
                        if (checkIfInBoard(pieceRow, horizontalMove)) {
                            if (pieces[pieceRow][horizontalMove] !== "  ") {
                                let firstPiece = identifyPiece(pieces[pieceRow][horizontalMove], pieceRow, horizontalMove);
                                if (firstPiece.side === piece.side && firstPiece.name === "rook") {
                                    let possibility = setPossibility(pieceRow, pieceColumn, 0, incrementToCheckCastling);
                                    if (possibility) {
                                        moves.push(possibility);
                                    }
                                }
                            }
                        }
                    } while (checkIfInBoard(pieceRow, horizontalMove) && pieces[pieceRow][horizontalMove] === "  ");
                }
                        
            }
        }

        return moves;
    }




    //function pour set les cases possibles pour les déplacements
    function setPossibility(pieceRow, pieceColumn, verticalMove, horizontalMove = 0){
        
        let newVerticalCoordinate = pieceRow + verticalMove;
        let newHorizontalCoordinate = pieceColumn + horizontalMove;

        if(checkIfInBoard(newVerticalCoordinate, newHorizontalCoordinate)){
            return newVerticalCoordinate + "-" + newHorizontalCoordinate;
        }else{
            return null;
        }
    }




    //function pour check si les données sont toujours dans les coordonnées possibles du plateau
    function checkIfInBoard(rowCoordinate, columnCoordinate){
        let inBoard = false;
        if ((rowCoordinate > -1 && rowCoordinate < 8) && (columnCoordinate > -1 && columnCoordinate < 8)) {
            inBoard = true;
        }

        return inBoard;
    }
}

export default ChessMoves;