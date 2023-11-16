import { useState } from 'react';
import Board from './Board';
import './App.css';


function Game() {
    const [pieces, setPieces] = useState([
        ['wc', 'wh', 'wb', 'wk', 'wq', 'wb', 'wh', 'wc'],
        ['wp', 'wp', 'wp', 'wp', 'wp', 'wp', 'wp', 'wp'],
        ['  ', '  ', '  ', '  ', '  ', '  ', '  ', '  '],
        ['  ', '  ', '  ', '  ', '  ', '  ', '  ', '  '],
        ['  ', '  ', '  ', '  ', '  ', '  ', '  ', '  '],
        ['  ', '  ', '  ', '  ', '  ', '  ', '  ', '  '],
        ['bp', 'bp', 'bp', 'bp', 'bp', 'bp', 'bp', 'bp'],
        ['bc', 'bh', 'bb', 'bk', 'bq', 'bb', 'bh', 'bc']
    ]);


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
                <li>1</li>
                <li>2</li>
                <li>3</li>
                <li>4</li>
                <li>5</li>
                <li>6</li>
                <li>7</li>
                <li>8</li>
            </ul>
            <ul className="game__el board">
                <Board pieces={pieces} setPieces={setPieces}/>
            </ul>
        </div>
    );
}

export default Game;
