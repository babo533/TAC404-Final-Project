import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useDocumentTitle from '../utils/useDocumentTitle';
import { usePlayer } from '../context/PlayerContext';
import StatCard from '../components/StatCard';

const Dashboard = () => {
  useDocumentTitle('Dashboard');
  const { currentUser } = usePlayer();
  const [games, setGames] = useState([]);
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const [gamesRes, goalsRes] = await Promise.all([
          fetch(`http://localhost:8000/games?playerId=${currentUser.id}`),
          fetch(`http://localhost:8000/goals?playerId=${currentUser.id}`),
        ]);

        const gamesData = await gamesRes.json();
        const goalsData = await goalsRes.json();

        setGames(gamesData);
        setGoals(goalsData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUser]);

  // --- Game Stats Calculation ---
  const totalGames = games.length;
  const totalGoals = games.reduce((sum, g) => sum + (g.goals || 0), 0);
  const totalAssists = games.reduce((sum, g) => sum + (g.assists || 0), 0);
  const wins = games.filter((g) => g.result === 'Win').length;

  const recentGames = [...games].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

  const calculateMatchRating = (game) => {
    let rating = 6.0;
    rating += (game.goals || 0) * 0.5;
    rating += (game.assists || 0) * 0.3;
    if (game.result === 'Win') rating += 0.5;
    if (game.result === 'Loss') rating -= 0.5;
    return Math.min(10, Math.max(1, rating)).toFixed(1);
  };

  const avgRating =
    totalGames > 0
      ? (
          games.reduce((acc, g) => acc + parseFloat(calculateMatchRating(g)), 0) / totalGames
        ).toFixed(1)
      : 'N/A';

  const getPlayerRank = (goalsScored) => {
    if (goalsScored >= 20) return 'Legend';
    if (goalsScored >= 10) return 'Star';
    if (goalsScored >= 5) return 'Starter';
    return 'Rookie';
  };

  const playerRank = getPlayerRank(totalGoals);

  if (loading || !currentUser) {
    return (
      <div className="flex justify-center items-center h-screen bg-slate-50 dark:bg-slate-900">
        <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        <div className="lg:col-span-2 bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-indigo-500 opacity-10 rounded-full blur-3xl"></div>

          <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-8">
            <div className="flex flex-col items-center justify-center w-32 h-40 bg-gradient-to-b from-yellow-400 to-yellow-600 rounded-t-full rounded-b-lg shadow-lg border-4 border-yellow-200">
              <span className="text-5xl font-black text-slate-900 mt-4">{totalGoals}</span>
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider mt-1">
                Goals
              </span>
            </div>

            <div className="flex-1 text-center sm:text-left">
              <div className="inline-block px-3 py-1 bg-indigo-500/30 border border-indigo-400/30 rounded-full text-xs font-bold uppercase tracking-wider mb-2 text-indigo-200">
                {playerRank} Status
              </div>
              <h1 className="text-4xl font-bold tracking-tight mb-1">{currentUser.name}</h1>
              <p className="text-slate-400 text-sm mb-6">
                {currentUser.position} • {totalGames} Matches Played
              </p>

              <div className="flex flex-wrap gap-4 justify-center sm:justify-start">
                <Link
                  to="/games/new"
                  className="px-6 py-3 bg-white text-slate-900 rounded-xl font-bold hover:bg-indigo-50 transition-colors shadow-lg"
                >
                  + Log Match
                </Link>
                <Link
                  to="/statistics"
                  className="px-6 py-3 bg-slate-700/50 text-white border border-slate-600 rounded-xl font-bold hover:bg-slate-700 transition-colors"
                >
                  View Stats
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats Panel */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-soft border border-slate-100 dark:border-slate-700 flex flex-col justify-center">
          <h3 className="text-slate-900 dark:text-white font-bold text-lg mb-6 flex items-center gap-2">
            <span className="w-2 h-6 bg-indigo-500 rounded-full"></span>
            Season Performance
          </h3>
          <div className="space-y-5">
            <div>
              <div className="flex justify-between text-sm font-bold mb-1 text-slate-700 dark:text-slate-300">
                <span>Win Rate</span>
                <span>{totalGames > 0 ? Math.round((wins / totalGames) * 100) : 0}%</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2">
                <div
                  className="bg-emerald-500 h-2 rounded-full"
                  style={{ width: `${totalGames > 0 ? (wins / totalGames) * 100 : 0}%` }}
                ></div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="bg-slate-50 dark:bg-slate-700/30 p-4 rounded-2xl">
                <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold">
                  Avg Rating
                </p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{avgRating}</p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-700/30 p-4 rounded-2xl">
                <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold">
                  Assists
                </p>
                <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                  {totalAssists}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <StatCard title="Total Matches" value={totalGames} color="primary" trend="Season" />
        <StatCard title="Goals" value={totalGoals} color="green" trend="Scored" />
        <StatCard title="Assists" value={totalAssists} color="blue" trend="Provided" />
        <StatCard
          title="Wins"
          value={wins}
          color="orange"
          trend={`${totalGames > 0 ? Math.round((wins / totalGames) * 100) : 0}% Rate`}
        />
      </div>

      {/* Recent Matches */}
      <h3 className="text-slate-900 dark:text-white font-bold text-xl mb-4 px-1">Recent Matches</h3>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {recentGames.length > 0 ? (
            recentGames.map((game) => (
              <div
                key={game.id}
                className="group bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md transition-all flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg ${
                      game.result === 'Win'
                        ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400'
                        : game.result === 'Draw'
                          ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400'
                          : 'bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400'
                    }`}
                  >
                    {game.result.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      vs. {game.opponent}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wide mt-1">
                      {game.goals} Goals • {game.assists} Assists
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-xs font-bold text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-md">
                    {game.date}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-8 text-center border-2 border-dashed border-slate-200 dark:border-slate-700">
              <p className="text-slate-500 dark:text-slate-400 font-medium">
                No matches logged yet.
              </p>
            </div>
          )}
        </div>

        {/* Active Goals */}
        <div className="space-y-4">
          {goals
            .filter((g) => !g.completed)
            .slice(0, 3)
            .map((goal) => {
              const progress = Math.min((goal.currentValue / goal.targetValue) * 100, 100);
              return (
                <div
                  key={goal.id}
                  className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700"
                >
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-xs font-bold text-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 dark:text-indigo-300 px-2 py-1 rounded uppercase tracking-wider">
                      Target
                    </span>
                    <span className="text-xs font-bold text-slate-400">
                      {Math.round(progress)}%
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-900 dark:text-white mb-3">{goal.title}</h4>
                  <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2">
                    <div
                      className="bg-indigo-500 h-2 rounded-full transition-all"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          {goals.filter((g) => !g.completed).length === 0 && (
            <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl p-6 text-center border border-indigo-100 dark:border-indigo-900">
              <p className="text-indigo-600 dark:text-indigo-300 font-bold">No active objectives</p>
              <Link
                to="/goals"
                className="text-sm text-indigo-500 dark:text-indigo-400 hover:underline mt-2 inline-block"
              >
                Set a new goal
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
