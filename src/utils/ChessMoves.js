function ChessMoves(piece, pieces,identifyPiece){

    switch (piece.name) {
        case "pawn":
            return pawnMoves(piece, pieces);

        case "knight":
            return knightMoves(piece, pieces);

        case "bishop":
            return [];

        case "rook":
            return [];

        case "queen":
            return [];

        case "king":
            return [];
    
        default:
            break;
    }


    //function pour voir les possibilités de déplacement d'un pion
    function pawnMoves(piece, pieces){
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

        //pour voir si le pion peut prendre ou pas (prise en diagonale uniquement)
        for (let i = -1; i < 2; i+=2) {
            let additionFactor = (1 * factorForUpAndDown);
            let verticalToTake = pieceRow + additionFactor;
            let horizontalToTake = pieceColumn + i;
            if (checkIfInBoard(verticalToTake, horizontalToTake)) {
                if (pieces[verticalToTake][horizontalToTake] !== "  ") {
                    if (identifyPiece(pieces[verticalToTake][horizontalToTake], verticalToTake, horizontalToTake).side !== piece.side) {
                        let possibility = setPossibility(pieceRow, pieceColumn, additionFactor, i);
                        if (possibility) {
                            moves.push(possibility);
                        }
                    }
                }
            }
        }
        
        return moves;
    }

    //function pour voir les possibilités de déplacement d'un cheval
    function knightMoves(piece, pieces){
        let moves = [];
        let pieceRow = Number(piece.coordinates.split('-')[0]);
        let pieceColumn = Number(piece.coordinates.split('-')[1]);

        for (let g = 0; g < 3; g++) {
            for (let h = -1; h < 2; h+=2) {
                for (let i = 1; i < 3; i++) {
                    for (let j = 1; j < 3; j++) {
                        //ajoute forcément 1 ou 2 à une des coordonnées
                        if (i !== j) {
                            //condition car les ajouts aux coordonnées X et Y du cheval ne sont jamais miroir
                            let moveRow = i;
                            let moveColumn = j;
                            
                            if (g === 0) {
                                //pour quand seul le X peut être négatif
                                moveRow = i * h;
                            }else if(g === 1){
                                //pour quand seul le Y peut être négatif
                                moveColumn = j * h;
                            }else{
                                //pour quand les deux peuvent être négatif
                                moveRow = i * h;
                                moveColumn = j * h;
                            }
                            let verticalMove = pieceRow + moveRow;
                            let horizontalMove = pieceColumn + moveColumn;

                            if (checkIfInBoard(verticalMove, horizontalMove)) {
                                if (pieces[verticalMove][horizontalMove] === "  ") {
                                    //vérifie si la case est vide
                                    let possibility = setPossibility(pieceRow, pieceColumn, moveRow, moveColumn);
                                    if (possibility) {
                                        moves.push(possibility);
                                    }
                                }else if (identifyPiece(pieces[verticalMove][horizontalMove], verticalMove, horizontalMove).side !== piece.side) {
                                    //vérifie si la pièce est de la même équipe (pas fait en même temps que si la case est vide car risque de causer des problèmes en cherchant des pièces sur des cases vides)
                                    let possibility = setPossibility(pieceRow, pieceColumn, moveRow, moveColumn);
                                    if (possibility) {
                                        moves.push(possibility);
                                    }
                                }
                            } 
                        }
                    }
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