import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import useDocumentTitle from '../utils/useDocumentTitle';
import { format } from 'date-fns';
import { usePlayer } from '../context/PlayerContext';

const Goals = () => {
  useDocumentTitle('Season Objectives');
  const { currentUser } = usePlayer();
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    skillId: '',
    targetValue: '',
    deadline: '',
  });
  const [errors, setErrors] = useState({});

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const goalsRes = await fetch(`http://localhost:8000/goals?playerId=${currentUser.id}`);
      const goalsData = await goalsRes.json();
      setGoals(goalsData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load goals');
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) {
      fetchData();
    }
  }, [currentUser, fetchData]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.targetValue || formData.targetValue <= 0)
      newErrors.targetValue = 'Target must be positive';
    if (!formData.deadline) newErrors.deadline = 'Deadline is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const goalData = {
        playerId: currentUser.id, // Assign to current user
        title: formData.title.trim(),
        skillId: parseInt(formData.skillId) || null,
        targetValue: parseInt(formData.targetValue),
        currentValue: 0,
        deadline: formData.deadline,
        completed: false,
        createdAt: new Date().toISOString().split('T')[0],
      };

      const response = await fetch('http://localhost:8000/goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(goalData),
      });

      if (response.ok) {
        const newGoal = await response.json();
        setGoals([...goals, newGoal]);
        setFormData({ title: '', skillId: '', targetValue: '', deadline: '' });
        setShowForm(false);
        toast.success('Goal created successfully!');
      } else {
        toast.error('Failed to create goal');
      }
    } catch (error) {
      console.error('Error creating goal:', error);
      toast.error('Failed to create goal');
    }
  };

  const handleUpdateProgress = async (goal, increment) => {
    const newValue = goal.currentValue + increment;
    if (newValue < 0) return;

    try {
      const updatedGoal = { ...goal, currentValue: newValue };

      if (newValue >= goal.targetValue && !goal.completed) {
        updatedGoal.completed = true;
        toast.success('Target reached! Goal completed.');
      }
      if (newValue < goal.targetValue && goal.completed) {
        updatedGoal.completed = false;
      }

      const response = await fetch(`http://localhost:8000/goals/${goal.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentValue: newValue, completed: updatedGoal.completed }),
      });

      if (response.ok) {
        setGoals(goals.map((g) => (g.id === goal.id ? updatedGoal : g)));
      }
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const handleToggleComplete = async (goal) => {
    try {
      const updatedGoal = { ...goal, completed: !goal.completed };
      const response = await fetch(`http://localhost:8000/goals/${goal.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: updatedGoal.completed }),
      });

      if (response.ok) {
        setGoals(goals.map((g) => (g.id === goal.id ? updatedGoal : g)));
        toast.success(updatedGoal.completed ? 'Goal completed!' : 'Goal active');
      }
    } catch (error) {
      console.error('Error updating goal:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this goal?')) {
      try {
        await fetch(`http://localhost:8000/goals/${id}`, { method: 'DELETE' });
        setGoals(goals.filter((g) => g.id !== id));
        toast.success('Goal deleted');
      } catch (error) {
        console.error('Error deleting goal:', error);
      }
    }
  };

  const activeGoals = goals.filter((g) => !g.completed);
  const completedGoals = goals.filter((g) => g.completed);

  const inputClass = (error) => `
    w-full px-4 py-3 rounded-xl border 
    bg-slate-50 dark:bg-slate-900 
    text-slate-900 dark:text-white
    focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all
    ${
      error
        ? 'border-rose-500 focus:ring-rose-500'
        : 'border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700'
    }
  `;

  if (loading || !currentUser)
    return (
      <div className="flex justify-center items-center h-screen bg-slate-50 dark:bg-slate-900">
        <div className="w-10 h-10 border-4 border-indigo-600 rounded-full animate-spin"></div>
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            Season Objectives
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Set targets for goals, assists, or matches played.
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all shadow-lg font-medium"
        >
          {showForm ? 'Cancel' : '+ New Objective'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-soft p-6 mb-8 animate-fade-in">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">
            Create New Objective
          </h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                Objective Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={inputClass(errors.title)}
                placeholder="e.g. Score 15 Goals"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                  Target Value *
                </label>
                <input
                  type="number"
                  name="targetValue"
                  value={formData.targetValue}
                  onChange={handleChange}
                  className={inputClass(errors.targetValue)}
                  placeholder="15"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                  Deadline *
                </label>
                <input
                  type="date"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleChange}
                  className={inputClass(errors.deadline)}
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg"
            >
              Create Objective
            </button>
          </form>
        </div>
      )}

      <div className="space-y-8">
        {/* Active Goals Grid */}
        {activeGoals.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activeGoals.map((goal) => {
              const progress = Math.min((goal.currentValue / goal.targetValue) * 100, 100);
              return (
                <div
                  key={goal.id}
                  className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-soft p-6 hover:shadow-lg transition-all"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                      {goal.title}
                    </h4>
                    <span className="text-xs font-bold bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 px-2 py-1 rounded uppercase">
                      Active
                    </span>
                  </div>

                  <div className="mb-6">
                    <div className="flex justify-between text-sm font-bold text-slate-500 dark:text-slate-400 mb-2">
                      <span>Progress</span>
                      <span className="text-indigo-600 dark:text-indigo-400">
                        {goal.currentValue} / {goal.targetValue}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => handleUpdateProgress(goal, -1)}
                        className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 font-bold text-slate-600 dark:text-slate-300"
                      >
                        -
                      </button>
                      <div className="flex-1 h-3 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                      <button
                        onClick={() => handleUpdateProgress(goal, 1)}
                        className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 hover:bg-indigo-200 dark:hover:bg-indigo-900/50 font-bold text-indigo-600 dark:text-indigo-400"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-slate-700">
                    <span className="text-xs font-bold text-slate-400">
                      Due {format(new Date(goal.deadline), 'MMM dd')}
                    </span>
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleToggleComplete(goal)}
                        className="text-sm font-bold text-emerald-600 hover:text-emerald-700"
                      >
                        Complete
                      </button>
                      <button
                        onClick={() => handleDelete(goal.id)}
                        className="text-sm font-bold text-rose-500 hover:text-rose-600"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Completed Goals */}
        {completedGoals.length > 0 && (
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
              Completed Objectives
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {completedGoals.map((goal) => (
                <div
                  key={goal.id}
                  className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 opacity-75 hover:opacity-100 transition-all"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-lg font-bold text-slate-700 dark:text-slate-300 line-through decoration-emerald-500">
                      {goal.title}
                    </h4>
                    <span className="text-xs font-bold bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-2 py-1 rounded uppercase">
                      Done
                    </span>
                  </div>
                  <div className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-4">
                    Final Score:{' '}
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                      {goal.currentValue} / {goal.targetValue}
                    </span>
                  </div>
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => handleToggleComplete(goal)}
                      className="text-sm font-bold text-slate-500 hover:text-slate-700"
                    >
                      Reopen
                    </button>
                    <button
                      onClick={() => handleDelete(goal.id)}
                      className="text-sm font-bold text-rose-500 hover:text-rose-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Goals;
