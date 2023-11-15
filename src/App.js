import { useState } from 'react';
import './App.css';

//pour former le plateau et ses intéractions
function Board(fullBoard) {
  var squares = [];
  let squareColor;

  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      //alternance des cases noires et blancs pour le damier
      if (i % 2 === 0) {
        if (j % 2 === 0) {
          squareColor = "white";
        }else{
          squareColor = "black";
        }
      }else{
        if (j % 2 === 0) {
          squareColor = "black";
        }else{
          squareColor = "white";
        }
      }

      //push dans le tableau la pièce avec sa key représentant sa position initiale, sa couleur et l'intéraction au click
      squares.push(<Square key={i + "-" + j} color={squareColor} onSquareClick={() => moveClicked(i, j)}></Square>);
    }
  }

  //au clique d'une case
  function moveClicked(row, column){
    let rowOfPiece = fullBoard[row];
    if (rowOfPiece[column] === ' ') {
      console.log("clicked on empty " + row);
    }else{
      console.log("clicked on the piece on " + row);
    }
  }

  return squares;
}

//function caractérisant une case
function Square({position, color, onSquareClick}){
  return <li className={"square " + color} key={position} onClick={onSquareClick}>

  </li>
}



function Game() {
  let piecesBatch = [];

  let pieces = [
    ['wc', 'wh', 'wb', 'wk', 'wq', 'wb', 'wh', 'wc'],
    ['wp', 'wp', 'wp', 'wp', 'wp', 'wp', 'wp', 'wp'],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    ['bp', 'bp', 'bp', 'bp', 'bp', 'bp', 'bp', 'bp'],
    ['bc', 'bh', 'bb', 'bk', 'bq', 'bb', 'bh', 'bc']
  ];

  for (let i = 0; i < 8; i++) {
    let rowOfPiece = pieces[i];
    for (let j = 0; j < 8; j++) {
      let pieceInRow = rowOfPiece[j];
      pieceInRow.split();
      //pour faire l'équipe noire après la blanche
      if (pieceInRow[0] === "b") {
        piecesBatch.push(<li className={`piece black ${pieceInRow} c${i}-${j}`} key={pieceInRow + i + "-" + j}>{pieceInRow[1]}</li>);
      }else{
        piecesBatch.push(<li className={`piece white ${pieceInRow} c${i}-${j}`} key={pieceInRow + i + "-" + j}>{pieceInRow[1]}</li>);
      }
    }
  }

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
        <Board fullBoard={pieces}/>
      </ul>
      <ul className="game__el pieces">
        {piecesBatch}
      </ul>
    </div>
  );
}

export default Game;
