import { Link } from 'react-router-dom';

export default function Home() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-600 via-indigo-700 to-blue-800 text-white overflow-hidden relative">
            {/* Background Shapes */}
            <div className="absolute top-10 left-10 w-32 h-32 bg-white opacity-10 rounded-full blur-xl animate-pulse"></div>
            <div className="absolute bottom-20 right-20 w-64 h-64 bg-pink-500 opacity-20 rounded-full blur-3xl"></div>

            <div className="z-10 text-center space-y-8 p-8 backdrop-blur-sm bg-white/5 rounded-3xl border border-white/10 shadow-2xl">
                <h1 className="text-7xl font-black tracking-tight drop-shadow-lg mb-2">
                    Kahoot!<span className="text-pink-400">Clone</span>
                </h1>
                <p className="text-xl text-purple-100 font-medium max-w-md mx-auto">
                    Create, host, and play quizzes in real-time. The ultimate learning platform.
                </p>

                <div className="flex flex-col sm:flex-row gap-6 justify-center mt-12">
                    <Link
                        to="/create"
                        className="group relative px-8 py-4 bg-white text-purple-700 rounded-xl font-black text-xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                    >
                        <span className="relative z-10">Create Quiz (Teacher)</span>
                        <div className="absolute inset-0 bg-gray-50 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
                    </Link>

                    <Link
                        to="/play"
                        className="group relative px-8 py-4 bg-green-500 text-white rounded-xl font-black text-xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                    >
                        <span className="relative z-10">Play Game (Student)</span>
                        <div className="absolute inset-0 bg-green-400 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
                    </Link>
                </div>
            </div>

            <div className="absolute bottom-4 text-white/50 text-sm">
                Built with MERN Stack & Tailwind
            </div>
        </div>
    );
}
