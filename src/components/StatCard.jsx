import React from 'react';

const StatCard = ({ title, value, trend, color = 'primary' }) => {
  const colorMap = {
    primary: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400',
    blue: 'bg-sky-50 text-sky-600 dark:bg-sky-900/30 dark:text-sky-400',
    purple: 'bg-violet-50 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400',
    orange: 'bg-orange-50 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
    green: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
  };

  const activeColorClass = colorMap[color] || colorMap.primary;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-soft hover:shadow-lg transition-all duration-300 border border-slate-100 dark:border-slate-700 group">
      <div className="flex justify-between items-start mb-4">
        <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">
          {title}
        </p>
        <div className={`w-2 h-2 rounded-full bg-current ${activeColorClass.split(' ')[1]}`}></div>
      </div>

      <div className="flex items-baseline gap-2">
        <h3 className="text-slate-900 dark:text-white text-4xl font-bold tracking-tight group-hover:scale-105 transition-transform origin-left">
          {value}
        </h3>
      </div>

      {trend && (
        <div className="mt-3 flex items-center">
          <div className={`px-2 py-1 rounded-md text-xs font-medium ${activeColorClass}`}>
            {trend}
          </div>
        </div>
      )}
    </div>
  );
};

export default StatCard;
