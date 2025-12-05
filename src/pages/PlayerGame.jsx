import { useEffect, useState } from 'react';
import io from 'socket.io-client';

import { BACKEND_URL } from '../config';

const socket = io(BACKEND_URL);

export default function PlayerGame() {
    const [joined, setJoined] = useState(false);
    const [pin, setPin] = useState('');
    const [name, setName] = useState('');
    const [gameStatus, setGameStatus] = useState('lobby'); // lobby, playing, answered, result
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [message, setMessage] = useState('');
    const [score, setScore] = useState(0);
    const [fastestAnswer, setFastestAnswer] = useState(null);

    useEffect(() => {
        socket.on('join-success', () => {
            setJoined(true);
            setGameStatus('lobby');
        });

        socket.on('error', (msg) => {
            alert(msg);
        });

        socket.on('game-started', () => {
            setGameStatus('playing');
        });

        socket.on('new-question', (question) => {
            setCurrentQuestion(question);
            setGameStatus('playing');
            setMessage('');
        });

        socket.on('question-ended', (data) => {
            setMessage('Time is up!');
            setGameStatus('result');
            if (data && data.fastestCorrectAnswer) {
                setFastestAnswer(data.fastestCorrectAnswer);
            } else {
                setFastestAnswer(null);
            }
        });

        socket.on('game-over', () => {
            setGameStatus('ended');
        });

        return () => {
            socket.off('join-success');
            socket.off('error');
            socket.off('game-started');
            socket.off('new-question');
            socket.off('question-ended');
            socket.off('game-over');
        };
    }, []);

    const joinGame = (e) => {
        e.preventDefault();
        if (pin && name) {
            socket.emit('player-join', { pin, name });
        }
    };

    const submitAnswer = (index) => {
        if (gameStatus === 'playing') {
            socket.emit('player-answer', { pin, answerIndex: index });
            setGameStatus('answered');
            setMessage('Answer Submitted!');
        }
    };

    if (!joined) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-purple-600 to-blue-800 p-4">
                <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-sm text-center">
                    <h1 className="text-4xl font-black text-gray-800 mb-8 tracking-tight">Kahoot!</h1>
                    <form onSubmit={joinGame} className="space-y-4">
                        <input
                            type="text"
                            placeholder="Game PIN"
                            value={pin}
                            onChange={(e) => setPin(e.target.value)}
                            className="w-full p-4 border-2 border-gray-300 rounded-lg text-center text-xl font-bold focus:border-purple-500 focus:ring-0 placeholder-gray-400"
                        />
                        <input
                            type="text"
                            placeholder="Nickname"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full p-4 border-2 border-gray-300 rounded-lg text-center text-xl font-bold focus:border-purple-500 focus:ring-0 placeholder-gray-400"
                        />
                        <button type="submit" className="w-full py-4 bg-black text-white font-black text-xl rounded-lg hover:bg-gray-800 transition shadow-lg transform active:scale-95">
                            Enter
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    if (gameStatus === 'lobby') {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-green-500 text-white p-8 text-center">
                <h1 className="text-5xl font-black mb-6">You're in!</h1>
                <p className="text-2xl font-medium mb-8">See your name on screen?</p>
                <div className="animate-spin text-6xl opacity-50">⏳</div>
            </div>
        );
    }

    if (gameStatus === 'playing') {
        return (
            <div className="grid grid-cols-2 gap-4 h-screen p-4 bg-gray-100">
                {['red', 'blue', 'yellow', 'green'].map((color, i) => (
                    <button
                        key={i}
                        onClick={() => submitAnswer(i)}
                        className={`
                        h-full rounded-xl shadow-lg flex items-center justify-center text-white active:scale-95 transition-transform
                        ${color === 'red' ? 'bg-red-500' : color === 'blue' ? 'bg-blue-500' : color === 'yellow' ? 'bg-yellow-500' : 'bg-green-500'}
                    `}
                    >
                        <div className="w-20 h-20 bg-black/20 rounded-full flex items-center justify-center text-4xl">
                            {i === 0 ? '▲' : i === 1 ? '◆' : i === 2 ? '●' : '■'}
                        </div>
                    </button>
                ))}
            </div>
        );
    }

    if (gameStatus === 'answered' || gameStatus === 'result') {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-purple-600 text-white p-8 text-center">
                <h1 className="text-4xl font-bold mb-8">{message}</h1>
                {gameStatus === 'answered' && (
                    <div className="text-xl opacity-80">Waiting for others...</div>
                )}
                <div className="mt-12 animate-bounce text-6xl">
                    {gameStatus === 'answered' ? '🤞' : '👀'}
                </div>

                {gameStatus === 'result' && fastestAnswer && (
                    <div className="mt-8 bg-white/20 backdrop-blur-md p-6 rounded-xl border border-white/30 animate-pulse">
                        <p className="text-lg font-medium mb-2">⚡ Fastest Correct Answer</p>
                        <p className="text-3xl font-black text-yellow-300">{fastestAnswer.name}</p>
                        <p className="text-sm opacity-80">{fastestAnswer.time}s</p>
                    </div>
                )}

                {gameStatus === 'result' && !fastestAnswer && (
                    <div className="mt-8 opacity-70">
                        No correct answers this round!
                    </div>
                )}
            </div>
        );
    }

    if (gameStatus === 'ended') {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-purple-800 text-white p-8 text-center">
                <h1 className="text-5xl font-black mb-6">Game Over</h1>
                <p className="text-2xl">Check the main screen for results!</p>
                <button onClick={() => window.location.reload()} className="mt-12 px-8 py-3 bg-white text-purple-800 font-bold rounded-lg">Play Again</button>
            </div>
        )
    }

    return <div className="min-h-screen bg-purple-600"></div>;
}
