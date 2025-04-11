import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import LandPage from './pages/index.js';
import ActionMovies from './components/categories/action.jsx';
import ComedyMovies from './components/categories/comedy.jsx';
import AnimationMovies from './components/categories/anime.jsx';
import HorrorMovies from './components/categories/horror.jsx';
import RomanceMovies from './components/categories/romance.jsx';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandPage />} />
          <Route path="/categories/action" element={<ActionMovies />} />
          <Route path="/categories/comedy" element={<ComedyMovies />} />
          <Route path="/categories/animation" element={<AnimationMovies />} />
          <Route path="/categories/horror" element={<HorrorMovies />} />
          <Route path="/categories/romance" element={<RomanceMovies />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;