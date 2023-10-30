import React, { useState } from "react";

function Square({ value, onSquareClick, highlight }) {
    return (
        <button className="square" onClick={onSquareClick}
            style={{ backgroundColor: highlight ? "red" : "" }}
        >
            {value}
        </button>
    );
}

function BoardRow({ rowArr, handleClick, startInd, winLine }) {
    return (
        <div className="board-row">
            {rowArr.map((item, index) => (
                <Square key={"Square" + (startInd + index)} value={item} onSquareClick={() => handleClick(startInd + index)}
                    highlight={winLine && winLine.includes(startInd + index)}
                />
            ))}
        </div>
    );
}

function Board({ xIsNext, squares, onPlay, winLine, currentMove }) {
    const row = 3;
    const col = 3;

    let statusMessage;
    if (winLine) {
        statusMessage = "Winner: " + (!xIsNext ? "X" : "O");
    } else if (currentMove === 9) {
        statusMessage = "Draw";
    }
    else {
        statusMessage = "Next Player: " + (xIsNext ? "X" : "O");
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
        onPlay(nextSquares);
    }

    return (
        <>
            <div className="status">{statusMessage}</div>
            {Array.from({ length: row }, (_, rowIndex) => (
                <BoardRow
                    key={"SquareRow" + rowIndex}
                    rowArr={squares.slice(rowIndex * col, (rowIndex + 1) * col)}
                    handleClick={handleClick}
                    startInd={rowIndex * col}
                    winLine={winLine}
                />
            ))}
        </>
    );
}

export function Game() {
    const [history, setHistory] = useState([Array(9).fill(null)]);
    const [currentMove, setCurrentMove] = useState(0);
    const [isAscending, setIsAscending] = useState(true);
    const xIsNext = currentMove % 2 === 0;
    const currentSquares = history[currentMove];
    const winLine = calculateWinner(currentSquares);

    function handlePlay(nextSquares) {
        const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
        setHistory(nextHistory);
        setCurrentMove(nextHistory.length - 1);
    }

    function jumpTo(nextMove) {
        setCurrentMove(nextMove);
    }

    const moves = history.map((squares, move) => {
        let des;
        if (move === currentMove) {
            return (
                <div key="current-history">
                    You are at move #{move}
                </div>
            );
        }
        if (move > 0) {
            des = "Go to move #" + move;
        } else {
            des = "Go to game start";
        }
        return (
            <li key={"history-button" + move}>
                <button onClick={() => jumpTo(move)}>{des}</button>
            </li>
        );
    })

    const orderedMoves = isAscending ? moves : moves.slice().reverse();

    function restart() {
        setCurrentMove(0);
        setHistory([Array(9).fill(null)]);
    }

    const restartButton =
        winLine || currentMove === 9
            ? <button onClick={restart}>Restart</button>
            : "";

    function reorder() {
        setIsAscending(!isAscending);
    }

    return (
        <div className="game">
            <div className="game-board">
                <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} winLine={winLine} currentMove={currentMove} />
                {restartButton}
            </div>
            <div className="game-info">
                <button onClick={reorder}>
                    {isAscending ? 'Descending' : 'Ascending'}
                </button>
                <ol>
                    {orderedMoves}
                </ol>
            </div>
        </div>
    )
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
