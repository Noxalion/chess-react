function findMovement(piece, pieces,identifyPiece){

    switch (piece.name) {
        case "pawn":
            return movePawn(piece, pieces);

        case "horse":
            return [];

        case "bishop":
            return [];

        case "castle":
            return [];

        case "queen":
            return [];

        case "king":
            return [];
    
        default:
            break;
    }


    //function pour voir les possibilités de déplacement d'un pion
    function movePawn(piece, pieces){
        let possibilitiesOfMoves = [];
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

        //pour les déplacements basique du pion
        if (pieceRow === pieceStartingRow) {
            //s'il n'a pas encore bougé, un pion peut avancer de deux cases
            for (let i = 1; i < 3; i++) {
                let additionFactor = (i * factorForUpAndDown);
                if (pieces[pieceRow + additionFactor][pieceColumn] === "  " && checkIfInBoard(pieceRow + additionFactor, pieceColumn)) {
                    let possibility = setPossibility(pieceRow, pieceColumn, additionFactor);
                    if (possibility) {
                        possibilitiesOfMoves.push(possibility);
                    }
                }else{
                    i = 3;
                }
            }
        }else{
            let additionFactor = (1 * factorForUpAndDown);
            //déplacement normal
            if (pieces[pieceRow + additionFactor][pieceColumn] === "  " && checkIfInBoard(pieceRow + additionFactor, pieceColumn)) {
                let possibility = setPossibility(pieceRow, pieceColumn, additionFactor);
                if (possibility) {
                    possibilitiesOfMoves.push(possibility);
                }
            }
        }

        //pour voir si le pion peut prendre ou pas (prise en diagonale uniquement)
        for (let i = -1; i < 2; i+=2) {
            let additionFactor = (1 * factorForUpAndDown);
            let verticalToTake = pieceRow + additionFactor;
            let horizontalToTake = pieceColumn + i;
            if (pieces[verticalToTake][horizontalToTake] !== "  " && checkIfInBoard(verticalToTake, horizontalToTake)) {
                if (identifyPiece(pieces[verticalToTake][horizontalToTake], verticalToTake, horizontalToTake).side !== piece.side) {
                    let possibility = setPossibility(pieceRow, pieceColumn, additionFactor, i);
                    if (possibility) {
                        possibilitiesOfMoves.push(possibility);
                    }
                }
            }
        }
        
        console.log(possibilitiesOfMoves);
        return possibilitiesOfMoves;
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

export default findMovement;