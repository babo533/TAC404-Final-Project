import React, { useState, useEffect } from 'react';

const GameForm = ({ initialData = null, onSubmit, submitButtonText = 'Save Game' }) => {
  const [formData, setFormData] = useState({
    date: '',
    opponent: '',
    location: '',
    result: 'Win',
    position: '',
    duration: '',
    goals: 0,
    assists: 0,
    passes: 0,
    notes: '',
    completed: true,
    playedFullMatch: true,
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.opponent.trim()) newErrors.opponent = 'Opponent name is required';
    if (!formData.location) newErrors.location = 'Location is required';
    if (!formData.position.trim()) newErrors.position = 'Position is required';
    if (!formData.duration || formData.duration <= 0)
      newErrors.duration = 'Duration must be positive';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });

    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const submissionData = {
        ...formData,
        duration: parseInt(formData.duration),
        goals: parseInt(formData.goals),
        assists: parseInt(formData.assists),
        passes: parseInt(formData.passes),
      };
      onSubmit(submissionData);
    }
  };

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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Match Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="date"
            className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2"
          >
            Date *
          </label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className={inputClass(errors.date)}
          />
          {errors.date && <p className="text-rose-500 text-sm mt-1">{errors.date}</p>}
        </div>
        <div>
          <label
            htmlFor="opponent"
            className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2"
          >
            Opponent *
          </label>
          <input
            type="text"
            id="opponent"
            name="opponent"
            value={formData.opponent}
            onChange={handleChange}
            className={inputClass(errors.opponent)}
            placeholder="e.g. Red Lions FC"
          />
          {errors.opponent && <p className="text-rose-500 text-sm mt-1">{errors.opponent}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Radio Buttons for Location */}
        <div>
          <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
            Location *
          </label>
          <div className="flex space-x-4 mt-2">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="location"
                value="Home"
                checked={formData.location === 'Home'}
                onChange={handleChange}
                className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-slate-300"
              />
              <span className="text-slate-700 dark:text-slate-300">Home</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="location"
                value="Away"
                checked={formData.location === 'Away'}
                onChange={handleChange}
                className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-slate-300"
              />
              <span className="text-slate-700 dark:text-slate-300">Away</span>
            </label>
          </div>
          {errors.location && <p className="text-rose-500 text-sm mt-1">{errors.location}</p>}
        </div>

        <div>
          <label
            htmlFor="result"
            className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2"
          >
            Result
          </label>
          <select
            id="result"
            name="result"
            value={formData.result}
            onChange={handleChange}
            className={inputClass(null)}
          >
            <option value="Win">Win</option>
            <option value="Draw">Draw</option>
            <option value="Loss">Loss</option>
          </select>
        </div>
        <div>
          <label
            htmlFor="position"
            className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2"
          >
            Position *
          </label>
          <input
            type="text"
            id="position"
            name="position"
            value={formData.position}
            onChange={handleChange}
            className={inputClass(errors.position)}
            placeholder="e.g. Striker"
          />
          {errors.position && <p className="text-rose-500 text-sm mt-1">{errors.position}</p>}
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-slate-100 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-700">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Match Stats</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <label
              htmlFor="duration"
              className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2"
            >
              Duration (min)
            </label>
            <input
              type="number"
              id="duration"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              className={inputClass(errors.duration)}
              placeholder="90"
            />
          </div>
          <div>
            <label
              htmlFor="goals"
              className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2"
            >
              Goals
            </label>
            <input
              type="number"
              id="goals"
              name="goals"
              value={formData.goals}
              onChange={handleChange}
              className={inputClass(null)}
              min="0"
            />
          </div>
          <div>
            <label
              htmlFor="assists"
              className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2"
            >
              Assists
            </label>
            <input
              type="number"
              id="assists"
              name="assists"
              value={formData.assists}
              onChange={handleChange}
              className={inputClass(null)}
              min="0"
            />
          </div>
          <div>
            <label
              htmlFor="passes"
              className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2"
            >
              Passes
            </label>
            <input
              type="number"
              id="passes"
              name="passes"
              value={formData.passes}
              onChange={handleChange}
              className={inputClass(null)}
              min="0"
            />
          </div>
        </div>

        {/* Checkbox for Full Match */}
        <div className="mt-4">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              id="playedFullMatch"
              name="playedFullMatch"
              checked={formData.playedFullMatch}
              onChange={handleChange}
              className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500 border-slate-300"
            />
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Played Full Match (90+ min)
            </span>
          </label>
        </div>
      </div>

      <div>
        <label
          htmlFor="notes"
          className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2"
        >
          Match Notes
        </label>
        <textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows="4"
          className={inputClass(null)}
          placeholder="Key moments, tactical thoughts..."
        />
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="px-6 py-3 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors font-bold"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-500/30"
        >
          {submitButtonText}
        </button>
      </div>
    </form>
  );
};

export default GameForm;
