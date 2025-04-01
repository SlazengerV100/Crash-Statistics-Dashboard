import './App.css'
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom';

import HomePage from './pages/HomePage';
import TimeSeriesPage from './pages/TimeSeriesPage';
import FactorsPage from './pages/FactorsPage';
import PredictorPage from './pages/PredictorPage';
import HelpPage from './pages/HelpPage';
import NavBar from './components/navigation/NavBar';

function App() {

  return (
    <>
      <Router>
        <NavBar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/time-series" element={<TimeSeriesPage />} />
          <Route path="/factors" element={<FactorsPage />} />
          <Route path="/predictor" element={<PredictorPage />} />
          <Route path="/help" element={<HelpPage />} />
          <Route path="*" element={<div>404 Not Found</div>} />
        </Routes>
      </Router>
    </>
  )
}

export default App
