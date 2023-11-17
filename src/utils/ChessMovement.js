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

        //s'il n'a pas encore bougé, un pion peut avancer de deux cases et faisant une boucle commençant à 1 et ne comprenant pas le max, je définis à la portée max du pion + 1 
        let maxRangeForPawnPlus1 = 2;
        if (pieceRow === pieceStartingRow) {
            maxRangeForPawnPlus1 = 3;
        }

        //la boucle pour gérer la portée du pion
        for (let i = 1; i < maxRangeForPawnPlus1; i++) {
            let additionFactor = (i * factorForUpAndDown);
            if (checkIfInBoard(pieceRow + additionFactor, pieceColumn)) {
                if (pieces[pieceRow + additionFactor][pieceColumn] === "  ") {
                    let possibility = setPossibility(pieceRow, pieceColumn, additionFactor);
                    if (possibility) {
                        possibilitiesOfMoves.push(possibility);
                    }
                }else{
                    //entre ici si le pion rencontre un obstacle
                    i = maxRangeForPawnPlus1;
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
                            possibilitiesOfMoves.push(possibility);
                        }
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