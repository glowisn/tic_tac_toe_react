import React, { useState } from "react";

export function Board() {
    const row = 3;
    const col = 3;
    const [xIsNext, setXIsNext] = useState(true);
    const [squares, setSquares] = useState(Array(9).fill(null));
    const winLine = calculateWinner(squares);

    let status;
    if (winLine) {
        status = "Winner: " + (!xIsNext ? "X" : "O");
    } else {
        status = "Next Player: " + (xIsNext ? "X" : "O");
    }

    function handleClick(i) {
        if (winLine) {
            return;
        }
        if (squares[i]) {
            return;
        }
        const nextSquares = squares.slice();
        if (xIsNext) {
            nextSquares[i] = "X";
        } else {
            nextSquares[i] = "O";
        }
        setSquares(nextSquares);
        setXIsNext(!xIsNext);
    }

    return (
        <>
            <div className="status">{status}</div>
            {Array.from({ length: row }, (_, rowIndex) => (
                <BoardRow
                    key={rowIndex}
                    rowArr={squares.slice(rowIndex * col, (rowIndex + 1) * col)}
                    handleClick={handleClick}
                    startInd={rowIndex * col}
                    winLine = {winLine}
                />
            ))}
        </>
    );
}

function BoardRow({ rowArr, handleClick, startInd, winLine }) {
    return (
        <div className="board-row">
            {rowArr.map((item, index) => (
                <Square key={index} value={item} onSquareClick={() => handleClick(startInd + index)}
                highlight = {winLine && winLine.includes(startInd + index)}
                 />
            ))}
        </div>
    );
}

function Square({ value, onSquareClick, highlight }) {
    return (
        <button className="square" onClick={onSquareClick}
        style={{backgroundColor: highlight ? "red" : ""}}
        >
            {value}
        </button>
    );
}

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const [a, b, c] = line;
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return line;
        }
    }
    return null;
}
