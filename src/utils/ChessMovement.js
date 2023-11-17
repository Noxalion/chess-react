function findMovement(piece, pieces,identifyPiece){

    switch (piece.name) {
        case "pawn":
            return movePawn(piece, pieces);

        case "horse":
            return null;

        case "bishop":
            return null;

        case "castle":
            return null;

        case "queen":
            return null;

        case "king":
            return null;
    
        default:
            break;
    }


    //function pour voir les possibilités de déplacement d'un pion
    function movePawn(piece, pieces){
        let squareOfPossibilities = [];
        let pieceRow = Number(piece.coordinates.split('-')[0]);
        let pieceColumn = Number(piece.coordinates.split('-')[1]);

        if (piece.side === "white") {
            //pour les déplacements basique du pion
            if (pieceRow === 1) {
                //s'il n'a pas encore bougé, un pion peut avancer de deux cases
                for (let i = 1; i < 3; i++) {
                    if (pieces[pieceRow + i][pieceColumn] === "  " && checkIfInBoard(pieceRow + i, pieceColumn)) {
                        setSquareOfPossibilities(squareOfPossibilities, pieceRow, pieceColumn, i);
                    }else{
                        i = 3;
                    }
                }
                
            }else{
                //déplacement normal
                if (pieces[pieceRow + 1][pieceColumn] === "  " && checkIfInBoard(pieceRow + 1, pieceColumn)) {
                    setSquareOfPossibilities(squareOfPossibilities, pieceRow, pieceColumn, 1);
                }
            }

            //pour voir si le pion peut prendre ou pas (prise en diagonale uniquement)
            for (let i = -1; i < 2; i+=2) {
                let verticalToTake = pieceRow + 1;
                let horizontalToTake = pieceColumn + i;
                if (pieces[verticalToTake][horizontalToTake] !== "  " && checkIfInBoard(verticalToTake, horizontalToTake)) {
                    if (identifyPiece(pieces[verticalToTake][horizontalToTake], verticalToTake, horizontalToTake).side !== "white") {
                        setSquareOfPossibilities(squareOfPossibilities, pieceRow, pieceColumn, 1, i);
                    }
                }
            }
        }else if(piece.side === "black"){
            //pour les déplacements basique du pion
            if (pieceRow === 6) {
                //s'il n'a pas encore bougé, un pion peut avancer de deux cases
                for (let i = 1; i < 3; i++) {
                    if (pieces[pieceRow - i][pieceColumn] === "  " && checkIfInBoard(pieceRow - i, pieceColumn)) {
                        setSquareOfPossibilities(squareOfPossibilities, pieceRow, pieceColumn, -i);
                    }else{
                        i = 3;
                    }
                }
            }else{
                //déplacement normal
                if (pieces[pieceRow - 1][pieceColumn] === "  " && checkIfInBoard(pieceRow - 1, pieceColumn)) {
                    setSquareOfPossibilities(squareOfPossibilities, pieceRow, pieceColumn, -1); 
                }
            }

            //pour voir si le pion peut prendre ou pas (prise en diagonale uniquement)
            for (let i = -1; i < 2; i+=2) {
                let verticalToTake = pieceRow - 1;
                let horizontalToTake = pieceColumn + i;
                if (pieces[verticalToTake][horizontalToTake] !== "  " && checkIfInBoard(verticalToTake, horizontalToTake)) {
                    if (identifyPiece(pieces[verticalToTake][horizontalToTake], verticalToTake, horizontalToTake).side !== "black") {
                        setSquareOfPossibilities(squareOfPossibilities, pieceRow, pieceColumn, -1, i);
                    }
                }
            }
        }
        
        console.log(squareOfPossibilities);
        return squareOfPossibilities;
    }

    //function pour set les cases possibles pour les déplacements
    function setSquareOfPossibilities(squareOfPossibilities, pieceRow, pieceColumn, verticalMove, horizontalMove = 0){
        
        let newVerticalCoordinate = pieceRow + verticalMove;
        let newHorizontalCoordinate = pieceColumn + horizontalMove;

        if(checkIfInBoard(newVerticalCoordinate, newHorizontalCoordinate)){
            squareOfPossibilities.push(newVerticalCoordinate + "-" + newHorizontalCoordinate);
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