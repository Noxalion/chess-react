import { useState } from "react";

//pour former le plateau et ses intéractions
function Board(props) {
    //réattribut les props définis dans Game
    let {pieces, setPieces} = props;
    
    let squares = [];
    let squareColor;
    //origine de la pièce selectionnée
    const [originCoordinates, setOriginCoordinates] = useState("");
    //destination de la pièce selectionnée
    const [destinationCoordinates, setDestinationCoordinates] = useState("");
    //état de la selection
    const [selectionState, setSelectionState] = useState("selectPiece");
    //object avec les infos sur la pièce selectionnée
    const [pieceSelected, setPieceSelected] = useState(null);
    
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
                    pieceOnSquare={piece}
                    originCoordinates={originCoordinates}
                    destinationCoordinates={destinationCoordinates}
                    identifyPiece={identifyPiece}
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
            setOrigin(row + '-' + column, pieceHere);
        }else if (selectionState === "selectMove"){
            //pour après avoir selectionner une pièce
            if (piece === '  ') {
                //si clique sur une case sans pièce (bouge la pièce)
                goToDestination(row + '-' + column);

            }else{
                //si clique sur une case avec pièce
                let pieceHere = identifyPiece(piece, row, column);

                if (pieceHere.coordinates === pieceSelected.coordinates){
                    //si clique sur la même case (déselectionne)
                    setOrigin('', null);

                }else if (pieceHere.side === pieceSelected.side) {
                    //si clique sur une case avec une pièce alliée (la selectionne alors)

                    setOrigin(row + '-' + column, pieceHere);

                }else{
                    //si clique sur une case avec un poèce adverse (la mange)
                    goToDestination(row + '-' + column);
                }
            }
        }
    }

    /*
    function setOriginAndDestination(origin, destination, piece = null, selectionState = "selectPiece"){
        setOriginCoordinates(origin);
        setDestinationCoordinates(destination);
        setPieceSelected(piece);
        setSelectionState(selectionState);

        //juste pour voir dans la console debug les actions faites
        console.log("NOUVELLE ACTION");
        console.log("origin: " + origin);
        console.log("destination: " + destination);
        console.log("pieceSelected: " + ((piece !== null) ? piece.side + " " + piece.name : "aucune"));
        console.log("next selectionState: " + selectionState);
        console.log("----------------------------------");
    }
    */

    function setOrigin(origin, piece = null){
        setOriginCoordinates(origin);
        setPieceSelected(piece);
        setSelectionState("selectMove");

        //juste pour voir dans la console debug les actions faites
        console.log("NOUVELLE ORIGIN");
        console.log("origin: " + origin);
        console.log("pieceSelected: " + ((piece !== null) ? piece.side + " " + piece.name : "aucune"));
        console.log("----------------------------------");
    }

    function goToDestination(destination){
        setDestinationCoordinates(destination);
        setSelectionState("selectPiece");

        //juste pour voir dans la console debug les actions faites
        console.log("NOUVELLE DESTINATION");
        console.log("origin: " + originCoordinates);
        console.log("destination: " + destination);
        console.log("pieceSelected: " + pieceSelected);
        console.log("----------------------------------");
    }
        
    //function pour identifier une pièce et crée l'object quand une pièce est selectionnée
    function identifyPiece(pieceNotation, row, column){
        pieceNotation.split();
        
        let tableName = {
            p: "pawn",
            h: "horse",
            b: "bishop",
            c: "castle",
            k: "king",
            q: "queen"
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
function Square({position, color, onSquareClick, row, column, pieceOnSquare, originCoordinates, destinationCoordinates, identifyPiece}){

    let squareAspect;
    if (originCoordinates === row + '-' + column) {
        squareAspect = "square " + color + " square--selected";
    }else if (destinationCoordinates === row + '-' + column) {
        squareAspect = "square " + color + " square--move";
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