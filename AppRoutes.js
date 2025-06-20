
// Example routing config for React Router
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Learn from './pages/Learn';
import News from './pages/News';
import Home from './pages/Home';

export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/learn" element={<Learn />} />
        <Route path="/news" element={<News />} />
      </Routes>
    </Router>
  );
}
