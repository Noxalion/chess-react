function findMovement(piece, pieces,identifyPiece){

    switch (piece.name) {
        case "pawn":
            return movePawn(piece, pieces);

        case "horse":
            
            break;

        case "bishop":
            
            break;

        case "castle":
            
            break;

        case "queen":
            
            break;

        case "king":
            
            break;
    
        default:
            break;
    }



    function movePawn(piece, pieces){
        let squareOfPossibilities = [];
        let pieceRow = piece.coordinates.split('-')[0];
        let pieceColumn = piece.coordinates.split('-')[1];

        if (piece.side === "white") {
            if (pieceRow === "1") {
                for (let i = 1; i < 3; i++) {
                    squareOfPossibilities.push((Number(pieceRow) + i) + "-" + pieceColumn); 
                }
                
            }else{
                squareOfPossibilities.push((Number(pieceRow) + 1) + "-" + pieceColumn);
            }
        }else{
            if (pieceRow === "6") {
                for (let i = 1; i < 3; i++) {
                    squareOfPossibilities.push((Number(pieceRow) - i) + "-" + pieceColumn); 
                }
            }else{
                squareOfPossibilities.push((Number(pieceRow) - 1) + "-" + pieceColumn);
            }
        }

        if (piece.side === "white") {
            for (let i = -1; i < 2; i+=2) {
                if (pieces[Number(pieceRow) + 1][Number(pieceColumn) + i] !== "  " && identifyPiece(pieces[Number(pieceRow) + 1][Number(pieceColumn) + i], [Number(pieceRow) + 1], [Number(pieceColumn) + i]).side !== "white") {
                    squareOfPossibilities.push((Number(pieceRow) + 1) + "-" + (Number(pieceColumn) + i));
                }
            }
        }else{
            for (let i = -1; i < 2; i+=2) {
                if (pieces[Number(pieceRow) - 1][Number(pieceColumn) + i] !== "  " && identifyPiece(pieces[Number(pieceRow) - 1][Number(pieceColumn) + i], [Number(pieceRow) - 1], [Number(pieceColumn) - i]).side !== "black") {
                    squareOfPossibilities.push((Number(pieceRow) + 1) + "-" + (Number(pieceColumn) + i));
                }
            }
        }
        
        return squareOfPossibilities;
    }
}

export default findMovement;