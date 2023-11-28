import { useState } from 'react';
import Board from './Board';
import './App.css';


function Game() {
    //tableau constitutionnel du jeu
    const [pieces, setPieces] = useState([
        ['wr', 'wn', 'wb', 'wk', 'wq', 'wb', 'wn', 'wr'],
        ['wp', 'wp', 'wp', 'wp', 'wp', 'wp', 'wp', 'wp'],
        ['  ', '  ', '  ', '  ', '  ', '  ', '  ', '  '],
        ['  ', '  ', '  ', '  ', '  ', '  ', '  ', '  '],
        ['  ', '  ', '  ', '  ', '  ', '  ', '  ', '  '],
        ['  ', '  ', '  ', '  ', '  ', '  ', '  ', '  '],
        ['bp', 'bp', 'bp', 'bp', 'bp', 'bp', 'bp', 'bp'],
        ['br', 'bn', 'bb', 'bk', 'bq', 'bb', 'bn', 'br']
    ]);

    //pour voir si un roque peut avoir lieu ou pas pour les blancs
    const [whiteCastlingPossibility, setWhiteCastlingPossibility] = useState({
        //avec la tour à gauche
        left: true,
        //avec la tour à droite
        right: true
    });

    //pour voir si un roque peut avoir lieu ou pas pour les blancs
    const [blackCastlingPossibility, setBlackCastlingPossibility] = useState({
        //avec la tour à gauche
        left: true,
        //avec la tour à droite
        right: true
    });

    //chaque case sur le plateau qui est attaqué par une pièce blanche
    const [whiteAttack, setWhiteAttack] = useState([
        [' ', 'x', 'x', 'x', 'x', 'x', 'x', ' '],
        ['x', 'x', 'x', 'x', 'x', 'x', 'x', 'x'],
        ['x', 'x', 'x', 'x', 'x', 'x', 'x', 'x'],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ']
    ]);

    //chaque case sur le plateau qui est attaqué par une pièce noire
    const [blackAttack, setBlackAttack] = useState([
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
        ['x', 'x', 'x', 'x', 'x', 'x', 'x', 'x'],
        ['x', 'x', 'x', 'x', 'x', 'x', 'x', 'x'],
        [' ', 'x', 'x', 'x', 'x', 'x', 'x', ' ']
    ]);

    //object sur l'état du roi blanc
    const [whiteKingState, setWhiteKingState] = useState({
        side: "white",
        type: "k",
        name: "king",
        coordinates: "0-3",
        state: "free"
    });

    //object sur l'état du roi noir
    const [blackKingState, setBlackKingState] = useState({
        side: "black",
        type: "k",
        name: "king",
        coordinates: "7-3",
        state: "free"
    });

    //valeur pour dire qui est le gagnant de la partie
    const [winner, setWinner] = useState("none");

    //function pour voir l'état du jeu (si un jour à gagner ou si ça continue)
    function checkGameState(latestWhiteKingState, latestBlackKingState) {
        if (latestWhiteKingState.state === "checkmate") {
            setWinner("Black wins");
        }else if(latestBlackKingState.state === "checkmate"){
            setWinner("White wins");
        }else if ((latestWhiteKingState.state === "stalemate" && teamTurn === "black") || (latestBlackKingState.state === "stalemate" && teamTurn === "white")){
            setWinner("Draw");
        }
    }

    //permet de savoir quel tour on est
    const [turn, setTurn] = useState(1);
    //variable pour qui peut jouer ce tour
    const [teamTurn, setTeamTurn] = useState("white");

    function finishTurn(latestWhiteKingState, latestBlackKingState){
        let newTurn = structuredClone(turn);
        if(newTurn % 2 === 1){
            setTeamTurn("black");
        }else{
            setTeamTurn("white");
        }
        newTurn++;
        checkGameState(latestWhiteKingState, latestBlackKingState);
        setTurn(newTurn);
    }

    //pour afficher ou non les cartes de promotion
    const [displayPromotion, setDisplayPromotion] = useState(false);

    //pour enregistrer le coup précédent
    const [previousMove, setPreviousMove] = useState([]);
        //previousMove[0] est pour la team
        //previousMove[1] est pour le type de pièce
        //previousMove[2] est pour les coordonnées d'origine
        //previousMove[3] est pour les coordonnées de destination
        //previousMove[4] et previousMove[4] sont pour si prends une pièce ou coup spécial

    //pour savoir si le mouvement précédent doit être highlight ou pas
    const [highlight, setHighlight] = useState(false);

    //function pour render le move précédent
    function PreviousMoveDisplay(){
        //pour que les coordonnées soient présenté correctement par rapport au plateau et plus par rapport aux tableaux du code
        let ColumnMatching = {
            0: "H",
            1: "G",
            2: "F",
            3: "E",
            4: "D",
            5: "C",
            6: "B",
            7: "A",
        };

        let originRow = Number(previousMove[2].split('-')[0]);
        let originColumn = previousMove[2].split('-')[1];
        let origin = ColumnMatching[originColumn] + (originRow + 1);

        let destinationRow = Number(previousMove[3].split('-')[0]);
        let destinationColumn = previousMove[3].split('-')[1];
        let destination = ColumnMatching[destinationColumn] + (destinationRow + 1);

        //les classes du "bouton" pour highlight le move précédent
        const [classesPreviousMove, setClassesPreviousMove] = useState("previousMove");
        
        //function pour update au hover les classes du highlight
        function highlightMouseOver(){
            setClassesPreviousMove("previousMove previousMove--highlight");
            setHighlight(true);
        }

        function highlightMouseOut(){
            setClassesPreviousMove("previousMove");
            setHighlight(false);
        }

        //description supp du move
        let specialInfo;
        if (previousMove[4] && previousMove[5]) {
            if (previousMove[4] === "took") {
                specialInfo = `took ${previousMove[5].name}`;

            }else if(previousMove[4] === "en passant") {
                let pieceTakenRow = Number(previousMove[5][3].split('-')[0]);
                let pieceTakenColumn = previousMove[5][3].split('-')[1];
                let pieceTakenCoordinates = ColumnMatching[pieceTakenColumn] + (pieceTakenRow + 1);

                specialInfo = `en passant took ${previousMove[5][1]} ${pieceTakenCoordinates}`;

            }else if(previousMove[4] === "castling") {
                let rookRow = Number(previousMove[5][0]);
                let rookColumn = previousMove[5][1];
                let rookCoordinates = ColumnMatching[rookColumn] + (rookRow + 1);

                specialInfo = `castling with rook ${rookCoordinates}`;
            }
        }

        let whiteKingMessage;
        if (whiteKingState.state !== "free") {
            whiteKingMessage = `white king ${whiteKingState.state}`;
        }

        let blackKingMessage;
        if (blackKingState.state !== "free") {
            blackKingMessage = `black king ${blackKingState.state}`;
        }
        
        return (
            <div className={classesPreviousMove} onMouseOver={highlightMouseOver} onMouseOut={highlightMouseOut}>
                <h2 className='previousMove__title'>Previous Move</h2>
                <p className='previousMove__info'>{`${previousMove[0]} ${previousMove[1]} ${origin} to ${destination}`}</p>
                <p className='previousMove__special'>{specialInfo}</p>
                <p className='previousMove__check'>{whiteKingMessage}</p>
                <p className='previousMove__check'>{blackKingMessage}</p>
            </div>
        );
    }

    //juste pour relancer le jeu, pour reset
    function refreshPage(){
        window.location.reload();
    }


    //le rendu du plateau de jeu
    return (
        <div className='game'>
            <div className={`turn turn--${teamTurn}`}>
                Turn of the {teamTurn} team
            </div>
            {winner !== "none" && 
                <div className={`winnerDisplay winnerDisplay--${winner.replace(/\s/g, '-')}`} onClick={refreshPage}>
                    {winner} 
                    <span className="winnerDisplay__clickText"> &gt; Click to refresh &lt; </span>
                </div>
            }
            <ul className='row-number'>
                <li>1</li>
                <li>2</li>
                <li>3</li>
                <li>4</li>
                <li>5</li>
                <li>6</li>
                <li>7</li>
                <li>8</li>
            </ul>
            <ul className='column-number'>
                <li>H</li>
                <li>G</li>
                <li>F</li>
                <li>E</li>
                <li>D</li>
                <li>C</li>
                <li>B</li>
                <li>A</li>
            </ul>
            <Board 
                pieces={pieces} 
                setPieces={setPieces}

                whiteCastlingPossibility={whiteCastlingPossibility}
                setWhiteCastlingPossibility={setWhiteCastlingPossibility}
                blackCastlingPossibility={blackCastlingPossibility}
                setBlackCastlingPossibility={setBlackCastlingPossibility}

                whiteAttack={whiteAttack}
                setWhiteAttack={setWhiteAttack}
                blackAttack={blackAttack}
                setBlackAttack={setBlackAttack}

                whiteKingState={whiteKingState}
                setWhiteKingState={setWhiteKingState}
                blackKingState={blackKingState}
                setBlackKingState={setBlackKingState}

                finishTurn={finishTurn}
                teamTurn={teamTurn}

                setDisplayPromotion={setDisplayPromotion}
                displayPromotion={displayPromotion}

                previousMove={previousMove}
                setPreviousMove={setPreviousMove}
                highlight={highlight}
            />
            {previousMove.length !==0 && <PreviousMoveDisplay />}
        </div>
    );
}

export default Game;
