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
        type: "wk",
        name: "king",
        coordinates: "0-3",
        state: "free"
    });

    //object sur l'état du roi noir
    const [blackKingState, setBlackKingState] = useState({
        side: "black",
        type: "bk",
        name: "king",
        coordinates: "7-3",
        state: "free"
    });


    //le rendu du plateau de jeu
    return (
        <div className='game'>
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
                <li>A</li>
                <li>B</li>
                <li>C</li>
                <li>D</li>
                <li>E</li>
                <li>F</li>
                <li>G</li>
                <li>H</li>
            </ul>
            <ul className="game__el board">
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
                />
            </ul>
        </div>
    );
}

export default Game;
