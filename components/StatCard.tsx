
import React from 'react';

interface StatCardProps {
  label: string;
  value: string;
  icon: string;
  trend?: string;
  trendColor?: string;
  badge?: string;
  iconBg: string;
  iconColor: string;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, icon, trend, trendColor, badge, iconBg, iconColor }) => {
  return (
    <div className="bg-surface-light dark:bg-surface-dark p-5 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col gap-1">
      <div className="flex items-start justify-between">
        <div className={`p-2 ${iconBg} rounded-lg ${iconColor}`}>
          <span className="material-symbols-outlined">{icon}</span>
        </div>
        {trend && (
          <span className={`${trendColor} text-sm font-bold bg-opacity-20 px-2 py-1 rounded-full`}>
            {trend}
          </span>
        )}
        {badge && (
          <span className="text-text-muted text-sm font-medium bg-gray-50 dark:bg-white/5 px-2 py-1 rounded-full">
            {badge}
          </span>
        )}
      </div>
      <div className="mt-2">
        <p className="text-text-muted text-sm font-medium">{label}</p>
        <p className="text-2xl font-extrabold text-text-main dark:text-white mt-1">{value}</p>
      </div>
    </div>
  );
};

export default StatCard;
