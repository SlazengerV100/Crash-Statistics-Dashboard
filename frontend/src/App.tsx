import { useState } from 'react'
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

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/time-series" element={<TimeSeriesPage />} />
          <Route path="/factors" element={<FactorsPage />} />
          <Route path="/predictor" element={<PredictorPage />} />
          <Route path="/help" element={<HelpPage />} />
          <Route path="*" element={<div>404 Not Found</div>} />
        </Routes>
      </Router>
      <div className="App">
        <h1>This is a counter</h1>
        <button onClick={() => setCount((count) => count + 1)}>
          count is: {count}
        </button>
      </div>
    </>
  )
}

export default App
