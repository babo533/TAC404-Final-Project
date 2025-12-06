import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';
import StatCard from '../components/StatCard';
import useDocumentTitle from '../utils/useDocumentTitle';
import { usePlayer } from '../context/PlayerContext';

const Statistics = () => {
  useDocumentTitle('Season Analytics');
  const { currentUser } = usePlayer();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8000/games?playerId=${currentUser.id}`);
      const data = await response.json();
      setGames(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load statistics');
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) {
      fetchData();
    }
  }, [currentUser, fetchData]);

  // --- KPI Calculations ---
  const totalGames = games.length;
  const totalGoals = games.reduce((sum, g) => sum + (g.goals || 0), 0);
  const totalAssists = games.reduce((sum, g) => sum + (g.assists || 0), 0);
  const totalMinutes = games.reduce((sum, g) => sum + (g.duration || 0), 0);

  // --- Chart Data Preparation ---
  const resultsData = [
    { name: 'Wins', value: games.filter((g) => g.result === 'Win').length },
    { name: 'Draws', value: games.filter((g) => g.result === 'Draw').length },
    { name: 'Losses', value: games.filter((g) => g.result === 'Loss').length },
  ].filter((d) => d.value > 0);

  const COLORS = ['#10b981', '#f59e0b', '#f43f5e']; // Green, Amber, Rose

  const performanceData = games.map((game) => ({
    opponent: game.opponent.substring(0, 3).toUpperCase(), // Short name
    fullOpponent: game.opponent,
    goals: game.goals || 0,
    assists: game.assists || 0,
    passes: game.passes || 0,
  }));

  if (loading || !currentUser) {
    return (
      <div className="flex justify-center items-center h-screen bg-slate-50 dark:bg-slate-900">
        <div className="w-10 h-10 border-4 border-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-10">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
          Season Analytics
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mt-2">
          Deep dive into your match performance.
        </p>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard title="Appearances" value={totalGames} color="primary" trend="Matches" />
        <StatCard
          title="Goals Scored"
          value={totalGoals}
          color="green"
          trend={`${(totalGoals / (totalGames || 1)).toFixed(1)} per game`}
        />
        <StatCard title="Assists" value={totalAssists} color="blue" trend="Total" />
        <StatCard title="Minutes Played" value={totalMinutes} color="purple" trend="Total Time" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Goal/Assist Contribution Chart */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-soft border border-slate-100 dark:border-slate-700 p-6">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">
            Match Contributions
          </h3>
          {performanceData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis
                  dataKey="opponent"
                  tick={{ fill: '#64748b' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis tick={{ fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip
                  cursor={{ fill: '#f1f5f9' }}
                  contentStyle={{
                    borderRadius: '12px',
                    border: 'none',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  }}
                />
                <Legend />
                <Bar dataKey="goals" fill="#10b981" name="Goals" radius={[4, 4, 0, 0]} />
                <Bar dataKey="assists" fill="#6366f1" name="Assists" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-slate-500 py-12">No match data yet.</p>
          )}
        </div>

        {/* Match Results Pie Chart */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-soft border border-slate-100 dark:border-slate-700 p-6">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Match Results</h3>
          {resultsData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={resultsData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {resultsData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                      stroke="none"
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: '12px',
                    border: 'none',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  }}
                />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-slate-500 py-12">No match results yet.</p>
          )}
        </div>
      </div>

      {/* Advanced Stats (Passes) */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-soft border border-slate-100 dark:border-slate-700 p-6 mb-8">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">
          Passing Performance
        </h3>
        {performanceData.length > 0 ? (
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis
                dataKey="opponent"
                tick={{ fill: '#64748b' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis tick={{ fill: '#64748b' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  borderRadius: '12px',
                  border: 'none',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                }}
              />
              <Line
                type="monotone"
                dataKey="passes"
                stroke="#8b5cf6"
                strokeWidth={3}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-center text-slate-500 py-12">No passing data available.</p>
        )}
      </div>
    </div>
  );
};

export default Statistics;
