import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import CreateQuiz from './pages/CreateQuiz';
import HostGame from './pages/HostGame';
import PlayerGame from './pages/PlayerGame';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<PlayerGame />} />
          <Route path="/create" element={<CreateQuiz />} />
          <Route path="/host/:quizId" element={<HostGame />} />
          <Route path="/play" element={<PlayerGame />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
