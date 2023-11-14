import { useState } from 'react';
import './App.css';

//function définissant le type de pièce qui est crée
function Piece(row, column, maxRows, team) {
  let type = null;
  let letter;
  const [position, setPosition] = useState([row, column]);

  if (row === 1 || row === maxRows - 2) {
    type = "pawn";
    letter = "P";
  }else if (row === 0 || row === maxRows - 1) {
    if (column === 0 || column === 7) {
      type = "castle";
      letter = "C";
    }else if (column === 1 || column === 6) {
      type = "horse";
      letter = "H";
    }else if (column === 2 || column === 5) {
      type = "bishop";
      letter = "B";
    }else if (column === 4) {
      type = "queen";
      letter = "Q";
    }else{
      type = "king";
      letter = "K";
    }
  }
  
  //pour éviter de créer des pièces "fantomes"
  if (type !== null) {
    return(<li className={`piece ${team} ${type} c${position[0]}-${position[1]}`} key={letter + row + "-" + column}>{letter}</li>);
  }
}


//pour initialiser les pièces à leur position de départ
function Pieces() {
  let pieces = [];
  let team = "white";

  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      //pour faire l'équipe noire après la blanche
      if (i >= 4) {
        team = "black";
      }
      pieces.push(Piece(i, j, 8, team));
    }
  }

  return pieces;
}


//pour former le plateau et ses intéractions
function Board() {
  var squares = [];
  let team;

  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      //alternance des cases noires et blancs pour le damier
      if (i % 2 === 0) {
        if (j % 2 === 0) {
          team = "white";
        }else{
          team = "black";
        }
      }else{
        if (j % 2 === 0) {
          team = "black";
        }else{
          team = "white";
        }
      }

      //push dans le tableau la pièce avec sa key représentant sa position initiale, sa couleur et l'intéraction au click
      squares.push(<Square key={i + "-" + j} color={team} onSquareClick={() => moveClicked((i + 1) + "-" + (j + 1))}></Square>);
    }
  }

  //au clique d'une case
  function moveClicked(i){
    console.log("clicked on " + i);
  }

  return squares;
}

//function caractérisant une case
function Square({position, color, onSquareClick}){
  return <li className={"square " + color} key={position} onClick={onSquareClick}></li>
}



function Game() {
  let pieces = Pieces();
  let board = Board();

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
        {board}
      </ul>
      <ul className="game__el pieces">
        {pieces}
      </ul>
    </div>
  );
}

export default Game;
