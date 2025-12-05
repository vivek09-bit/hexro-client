import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import io from 'socket.io-client';

const socket = io(`http://${window.location.hostname}:5001`);

export default function HostGame() {
    const { quizId } = useParams();
    const [pin, setPin] = useState(null);
    const [players, setPlayers] = useState([]);
    const [gameStatus, setGameStatus] = useState('lobby'); // lobby, playing, ended
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [timer, setTimer] = useState(0);
    const [fastestAnswer, setFastestAnswer] = useState(null);

    useEffect(() => {
        socket.emit('host-create-game', quizId);

        socket.on('game-created', (gamePin) => {
            setPin(gamePin);
        });

        socket.on('player-joined', (player) => {
            setPlayers((prev) => [...prev, player]);
        });

        socket.on('game-started', () => {
            setGameStatus('playing');
        });

        socket.on('new-question', (question) => {
            setCurrentQuestion(question);
            setFastestAnswer(null);
        });

        socket.on('timer-tick', (timeLeft) => {
            setTimer(timeLeft);
        });

        socket.on('question-ended', (data) => {
            if (data && data.fastestCorrectAnswer) {
                setFastestAnswer(data.fastestCorrectAnswer);
            }
        });

        socket.on('player-answered', (data) => {
            // Update UI to show who answered?
        });

        socket.on('game-over', (finalPlayers) => {
            setGameStatus('ended');
            setPlayers(finalPlayers);
        });

        return () => {
            socket.off('game-created');
            socket.off('player-joined');
            socket.off('game-started');
            socket.off('new-question');
            socket.off('timer-tick');
            socket.off('question-ended');
            socket.off('game-over');
        };
    }, [quizId]);

    const startGame = () => {
        socket.emit('host-start-game', pin);
    };

    const nextQuestion = () => {
        socket.emit('host-next-question', pin);
    };

    if (gameStatus === 'lobby') {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-600 to-indigo-800 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>

                <div className="z-10 text-center w-full max-w-4xl">
                    <div className="mb-12">
                        <h1 className="text-3xl font-bold mb-4 opacity-80">Join at <span className="text-white">kahoot-clone.com</span> with PIN:</h1>
                        <div className="inline-block bg-white text-black text-8xl font-black px-12 py-6 rounded-2xl shadow-2xl tracking-widest animate-pulse">
                            {pin || '...'}
                        </div>
                    </div>

                    <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 min-h-[300px] border border-white/20">
                        <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
                            <h2 className="text-2xl font-bold flex items-center">
                                <span className="bg-white text-purple-600 rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm">
                                    {players.length}
                                </span>
                                Players in Lobby
                            </h2>
                            <div className="text-sm opacity-70">Waiting for players...</div>
                        </div>

                        {players.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-48 opacity-50">
                                <div className="text-6xl mb-4">👋</div>
                                <p className="text-xl">Waiting for someone to join...</p>
                            </div>
                        ) : (
                            <div className="flex flex-wrap gap-4 justify-center">
                                {players.map((p, i) => (
                                    <div key={i} className="bg-white text-purple-700 px-6 py-3 rounded-xl font-bold text-xl shadow-lg animate-bounce" style={{ animationDelay: `${i * 0.1}s` }}>
                                        {p.name}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <button
                        onClick={startGame}
                        disabled={players.length === 0}
                        className="mt-12 px-16 py-5 bg-white text-purple-700 text-3xl font-black rounded-xl shadow-xl hover:bg-gray-100 hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
                    >
                        Start Game
                    </button>
                </div>
            </div>
        );
    }

    if (gameStatus === 'playing' && currentQuestion) {
        return (
            <div className="flex flex-col min-h-screen bg-gray-100">
                <div className="bg-purple-700 text-white p-4 flex justify-between items-center shadow-md">
                    <div className="font-bold text-xl opacity-80">Question {currentQuestion.qIndex + 1} / {currentQuestion.totalQuestions}</div>
                    <div className="font-black text-2xl">Kahoot! Clone</div>
                </div>

                <div className="flex-1 flex flex-col items-center justify-center p-8 relative">
                    <div className="absolute top-8 right-8 w-24 h-24 rounded-full bg-purple-600 text-white flex items-center justify-center text-4xl font-black shadow-xl border-4 border-white z-10">
                        {timer}
                    </div>

                    <div className="w-full max-w-5xl mb-12 text-center">
                        <div className="bg-white p-12 rounded-2xl shadow-xl border-b-8 border-gray-200">
                            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 leading-tight">{currentQuestion.questionText}</h2>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-6xl">
                        {currentQuestion.options.map((opt, i) => (
                            <div key={i} className={`
                        p-8 rounded-xl text-white text-2xl md:text-3xl font-bold flex items-center shadow-lg transform transition-transform hover:scale-[1.01] cursor-default
                        ${i === 0 ? 'bg-red-500' : i === 1 ? 'bg-blue-500' : i === 2 ? 'bg-yellow-500' : 'bg-green-500'}
                    `}>
                                <div className="w-12 h-12 bg-black/20 rounded-full flex items-center justify-center mr-6 text-xl">
                                    {i === 0 ? '▲' : i === 1 ? '◆' : i === 2 ? '●' : '■'}
                                </div>
                                {opt}
                            </div>
                        ))}
                    </div>

                    {timer === 0 && (
                        <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/90 backdrop-blur border-t flex justify-between items-center z-50">
                            <div className="flex-1">
                                {fastestAnswer ? (
                                    <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded shadow-lg animate-bounce">
                                        <p className="font-bold text-lg">⚡ Fastest Correct Answer:</p>
                                        <p className="text-xl">{fastestAnswer.name} in {fastestAnswer.time}s</p>
                                    </div>
                                ) : (
                                    <div className="text-gray-500 italic">No correct answers this round.</div>
                                )}
                            </div>
                            <button onClick={nextQuestion} className="px-10 py-4 bg-purple-600 text-white rounded-xl text-xl font-bold shadow-lg hover:bg-purple-700 transition-colors ml-4">
                                Next Question →
                            </button>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    if (gameStatus === 'ended') {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-purple-900 text-white overflow-hidden relative">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>

                <h1 className="text-7xl font-black mb-12 drop-shadow-lg z-10">Podium</h1>

                <div className="flex items-end justify-center gap-4 mb-16 z-10 h-96">
                    {/* Second Place */}
                    {players.length > 1 && (
                        <div className="flex flex-col items-center animate-slide-up" style={{ animationDelay: '0.5s' }}>
                            <div className="text-xl font-bold mb-2">{players.sort((a, b) => b.score - a.score)[1].name}</div>
                            <div className="w-32 bg-gray-300 h-48 rounded-t-lg flex items-start justify-center pt-4 text-4xl font-black text-gray-600 shadow-xl relative">
                                2
                                <div className="absolute bottom-4 text-lg text-gray-600 font-bold">{players.sort((a, b) => b.score - a.score)[1].score}</div>
                            </div>
                        </div>
                    )}

                    {/* First Place */}
                    {players.length > 0 && (
                        <div className="flex flex-col items-center animate-slide-up">
                            <div className="text-3xl font-bold mb-2 text-yellow-300">👑 {players.sort((a, b) => b.score - a.score)[0].name}</div>
                            <div className="w-40 bg-yellow-400 h-64 rounded-t-lg flex items-start justify-center pt-4 text-6xl font-black text-yellow-700 shadow-2xl relative z-20">
                                1
                                <div className="absolute bottom-4 text-2xl text-yellow-800 font-bold">{players.sort((a, b) => b.score - a.score)[0].score}</div>
                            </div>
                        </div>
                    )}

                    {/* Third Place */}
                    {players.length > 2 && (
                        <div className="flex flex-col items-center animate-slide-up" style={{ animationDelay: '1s' }}>
                            <div className="text-xl font-bold mb-2">{players.sort((a, b) => b.score - a.score)[2].name}</div>
                            <div className="w-32 bg-orange-400 h-32 rounded-t-lg flex items-start justify-center pt-4 text-4xl font-black text-orange-800 shadow-xl relative">
                                3
                                <div className="absolute bottom-4 text-lg text-orange-800 font-bold">{players.sort((a, b) => b.score - a.score)[2].score}</div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="z-10 bg-white/10 backdrop-blur-md p-8 rounded-xl max-w-2xl w-full mx-4">
                    <h3 className="text-2xl font-bold mb-4 border-b border-white/20 pb-2">Full Results</h3>
                    <div className="max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                        {players.sort((a, b) => b.score - a.score).map((p, i) => (
                            <div key={i} className="flex justify-between items-center py-3 border-b border-white/10 last:border-0">
                                <div className="flex items-center">
                                    <span className="font-bold mr-4 w-8 text-right opacity-70">{i + 1}.</span>
                                    <span className="font-medium text-lg">{p.name}</span>
                                </div>
                                <span className="font-bold bg-white/20 px-3 py-1 rounded-lg">{p.score} pts</span>
                            </div>
                        ))}
                    </div>
                </div>

                <Link to="/" className="mt-8 z-10 px-8 py-3 bg-white text-purple-900 font-bold rounded-lg hover:bg-gray-100 transition">Back to Home</Link>
            </div>
        )
    }

    return <div className="min-h-screen flex items-center justify-center bg-purple-600 text-white font-bold text-2xl">Loading Game...</div>;
}
