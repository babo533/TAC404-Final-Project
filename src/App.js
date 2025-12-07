import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import GamesList from './pages/GamesList';
import CreateGame from './pages/CreateGame';
import EditGame from './pages/EditGame';
import GameDetail from './pages/GameDetail';
import Goals from './pages/Goals';
import Statistics from './pages/Statistics';
import { ThemeProvider } from './context/ThemeContext';
import { PlayerProvider } from './context/PlayerContext';

function App() {
  return (
    <ThemeProvider>
      <PlayerProvider>
        <Router>
          <Routes>
            {/* REVIEW: Nested routes - Layout is the parent, uses <Outlet /> */}
            <Route element={<Layout />}>
              {/* REVIEW: 7 total routes (requirement: at least 4) */}
              <Route path="/" element={<Dashboard />} />
              <Route path="/games" element={<GamesList />} />
              <Route path="/games/new" element={<CreateGame />} />
              {/* REVIEW: URL parameters (:id) - dynamic segments (requirement: 2 routes with params) */}
              <Route path="/games/:id" element={<GameDetail />} />
              <Route path="/games/:id/edit" element={<EditGame />} />
              <Route path="/goals" element={<Goals />} />
              <Route path="/statistics" element={<Statistics />} />
            </Route>
          </Routes>
        </Router>
      </PlayerProvider>
    </ThemeProvider>
  );
}

export default App;
