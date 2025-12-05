import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { BACKEND_URL } from '../config';

export default function CreateQuiz() {
    const [title, setTitle] = useState('');
    const [questions, setQuestions] = useState([
        { questionText: '', options: ['', '', '', ''], correctOptionIndex: 0, timeLimit: 20 }
    ]);
    const navigate = useNavigate();

    const addQuestion = () => {
        setQuestions([...questions, { questionText: '', options: ['', '', '', ''], correctOptionIndex: 0, timeLimit: 20 }]);
    };

    const handleQuestionChange = (index, field, value) => {
        const newQuestions = [...questions];
        newQuestions[index][field] = value;
        setQuestions(newQuestions);
    };

    const handleOptionChange = (qIndex, oIndex, value) => {
        const newQuestions = [...questions];
        newQuestions[qIndex].options[oIndex] = value;
        setQuestions(newQuestions);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${BACKEND_URL}/api/quizzes`, { title, questions });
            navigate(`/host/${res.data._id}`);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="bg-purple-600 px-8 py-6">
                        <h1 className="text-3xl font-black text-white">Create a New Quiz</h1>
                        <p className="text-purple-200 mt-2">Build your challenge and test your students!</p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8 space-y-8">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Quiz Title</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-0 text-lg transition-colors bg-gray-50"
                                placeholder="e.g., World Geography 101"
                                required
                            />
                        </div>

                        <div className="space-y-6">
                            {questions.map((q, qIndex) => (
                                <div key={qIndex} className="bg-gray-50 p-6 rounded-xl border-2 border-gray-200 relative group hover:border-purple-300 transition-colors">
                                    <div className="absolute top-4 right-4 text-gray-400 font-bold text-5xl opacity-10 select-none">
                                        {qIndex + 1}
                                    </div>

                                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                                        <span className="bg-purple-100 text-purple-600 w-8 h-8 flex items-center justify-center rounded-full mr-3 text-sm">
                                            {qIndex + 1}
                                        </span>
                                        Question Details
                                    </h3>

                                    <input
                                        type="text"
                                        placeholder="What is the question?"
                                        value={q.questionText}
                                        onChange={(e) => handleQuestionChange(qIndex, 'questionText', e.target.value)}
                                        className="w-full p-3 border border-gray-300 rounded-lg mb-6 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                                        required
                                    />

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                        {q.options.map((opt, oIndex) => (
                                            <div key={oIndex} className="relative">
                                                <div className={`absolute inset-y-0 left-0 w-2 rounded-l-lg ${oIndex === 0 ? 'bg-red-500' : oIndex === 1 ? 'bg-blue-500' : oIndex === 2 ? 'bg-yellow-500' : 'bg-green-500'
                                                    }`}></div>
                                                <input
                                                    type="text"
                                                    placeholder={`Option ${oIndex + 1}`}
                                                    value={opt}
                                                    onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                                                    className={`w-full p-3 pl-6 border rounded-lg ${q.correctOptionIndex === oIndex
                                                        ? 'border-green-500 ring-2 ring-green-100 bg-green-50'
                                                        : 'border-gray-300'
                                                        }`}
                                                    required
                                                />
                                                {q.correctOptionIndex === oIndex && (
                                                    <div className="absolute right-3 top-3 text-green-500">
                                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex flex-wrap items-center gap-6 bg-white p-4 rounded-lg border border-gray-200">
                                        <div className="flex items-center space-x-3">
                                            <label className="font-semibold text-gray-600 text-sm">Correct Answer:</label>
                                            <select
                                                value={q.correctOptionIndex}
                                                onChange={(e) => handleQuestionChange(qIndex, 'correctOptionIndex', parseInt(e.target.value))}
                                                className="p-2 border rounded-md bg-gray-50 font-medium text-gray-700 focus:border-purple-500 focus:ring-0"
                                            >
                                                {q.options.map((_, i) => <option key={i} value={i}>Option {i + 1}</option>)}
                                            </select>
                                        </div>

                                        <div className="flex items-center space-x-3">
                                            <label className="font-semibold text-gray-600 text-sm">Time Limit:</label>
                                            <div className="flex items-center">
                                                <input
                                                    type="number"
                                                    value={q.timeLimit}
                                                    onChange={(e) => handleQuestionChange(qIndex, 'timeLimit', parseInt(e.target.value))}
                                                    className="p-2 border rounded-l-md w-20 bg-gray-50 font-medium text-gray-700 focus:border-purple-500 focus:ring-0"
                                                />
                                                <span className="bg-gray-200 px-3 py-2 rounded-r-md text-gray-600 text-sm font-bold">sec</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                            <button
                                type="button"
                                onClick={addQuestion}
                                className="flex items-center px-6 py-3 bg-white border-2 border-blue-500 text-blue-600 rounded-xl font-bold hover:bg-blue-50 transition-colors"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                                Add Question
                            </button>

                            <button
                                type="submit"
                                className="px-8 py-3 bg-green-500 text-white rounded-xl font-black text-lg shadow-lg hover:bg-green-600 hover:shadow-xl hover:-translate-y-0.5 transition-all"
                            >
                                Save & Host Game
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
