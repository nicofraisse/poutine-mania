import React from "react";
import classNames from "classnames";

const StatCard = ({ title, value, newValue, className }) => {
  return (
    <div
      className={classNames(
        "bg-white rounded-lg border border-gray-200 p-4 shadow-sm",
        className
      )}
    >
      <div className="text-sm text-gray-500 mb-1">{title}</div>
      <div className="text-2xl font-bold text-gray-900">
        {value.toLocaleString()}
      </div>
      {newValue !== undefined && newValue > 0 && (
        <div className="text-sm text-green-600 mt-1">
          +{newValue} in last 7 days
        </div>
      )}
    </div>
  );
};

const AdminStats = ({ stats }) => {
  return (
    <div className="mt-6">
      <div className="text-lg font-semibold text-gray-900 mb-4">
        Site Statistics
      </div>
      <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Users"
          value={stats.users.total}
          newValue={stats.users.newLast7Days}
        />
        <StatCard
          title="Total Restaurants"
          value={stats.restaurants.total}
          newValue={stats.restaurants.newLast7Days}
        />
        <StatCard
          title="Total Reviews"
          value={stats.reviews.total}
          newValue={stats.reviews.newLast7Days}
        />
        <StatCard
          title="Approved Restaurants"
          value={stats.restaurants.approved}
        />
        <StatCard
          title="Pending Restaurants"
          value={stats.restaurants.pending}
        />
      </div>
    </div>
  );
};

export default AdminStats;
