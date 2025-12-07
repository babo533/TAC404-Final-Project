import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import useDocumentTitle from '../utils/useDocumentTitle';
import { usePlayer } from '../context/PlayerContext';

const GamesList = () => {
  useDocumentTitle('Match History');
  const { currentUser } = usePlayer();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // REVIEW: GET request - fetches all games for current player
      const response = await fetch(`http://localhost:8000/games?playerId=${currentUser.id}`);
      const data = await response.json();
      setGames(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load games');
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) {
      fetchData();
    }
  }, [currentUser, fetchData]);

  const handleDelete = async (id) => {
    if (window.confirm(`Are you sure you want to delete this match?`)) {
      try {
        // REVIEW: DELETE request - removes game by ID
        const response = await fetch(`http://localhost:8000/games/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setGames(games.filter((game) => game.id !== id));
          // REVIEW: Toast notification for successful delete
          toast.success('Match deleted successfully!');
        } else {
          toast.error('Failed to delete match');
        }
      } catch (error) {
        console.error('Error deleting match:', error);
        toast.error('Failed to delete match');
      }
    }
  };

  const filteredGames = filter === 'all' ? games : games.filter((g) => g.result === filter);

  const sortedGames = [...filteredGames].sort((a, b) => new Date(b.date) - new Date(a.date));

  const resultColors = {
    Win: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    Draw: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    Loss: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
  };

  if (loading || !currentUser) {
    return (
      <div className="flex justify-center items-center h-screen bg-slate-50 dark:bg-slate-900">
        <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            Match History
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Track your performance game by game.
          </p>
        </div>

        <div className="flex gap-4">
          <Link
            to="/games/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-500/30 text-sm font-medium"
          >
            <span>+ Log Match</span>
          </Link>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <label
            htmlFor="result-filter"
            className="text-sm font-medium text-slate-700 dark:text-slate-300 whitespace-nowrap"
          >
            Filter by:
          </label>
          <select
            id="result-filter"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full sm:w-auto px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50 dark:bg-slate-900 dark:text-white hover:bg-white dark:hover:bg-slate-800 transition-colors outline-none cursor-pointer"
          >
            <option value="all">All Results</option>
            <option value="Win">Wins</option>
            <option value="Draw">Draws</option>
            <option value="Loss">Losses</option>
          </select>
        </div>
        <span className="text-xs text-slate-400 font-medium px-2">
          Showing {sortedGames.length} matches
        </span>
      </div>

      <div className="space-y-4">
        {sortedGames.length > 0 ? (
          sortedGames.map((game) => (
            <div
              key={game.id}
              className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md transition-all group"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-md uppercase tracking-wide ${resultColors[game.result]}`}
                    >
                      {game.result}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">{game.date}</span>
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">
                      {game.location}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    vs. {game.opponent}
                  </h3>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 dark:text-slate-400 mt-2">
                    <span className="flex items-center gap-1 font-medium">
                      {game.goals} G / {game.assists} A
                    </span>
                    <span className="flex items-center gap-1 text-slate-400">|</span>
                    <span>{game.position}</span>
                    <span className="flex items-center gap-1 text-slate-400">|</span>
                    <span>{game.duration} min</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-4 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-700">
                  <Link
                    to={`/games/${game.id}`}
                    className="px-4 py-2 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-400 dark:hover:bg-indigo-900/50 rounded-lg transition-colors text-sm font-medium"
                  >
                    Stats
                  </Link>
                  <Link
                    to={`/games/${game.id}/edit`}
                    className="px-4 py-2 text-slate-600 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600 rounded-lg transition-colors text-sm font-medium"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(game.id)}
                    className="px-4 py-2 text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-900/20 rounded-lg transition-colors text-sm font-medium border border-transparent hover:border-rose-200 dark:hover:border-rose-800"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white dark:bg-slate-800 p-12 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 text-center">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl"></div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              No matches found
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
              Get started by logging your first game.
            </p>
            <Link
              to="/games/new"
              className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-medium shadow-lg"
            >
              Log Match
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default GamesList;
