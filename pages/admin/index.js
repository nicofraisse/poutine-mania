import React, { useState, useEffect } from "react";
import AdminStats from "../../components/AdminStats";
import AdminLayout from "../../components/AdminLayout";
import { withI18n } from "../../lib/withI18n";

const index = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/admin/stats");
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error("Failed to fetch admin stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <AdminLayout activeTab="statistics">
      {loading && <div className="text-gray-500">Loading statistics...</div>}
      {stats && !loading && <AdminStats stats={stats} />}
    </AdminLayout>
  );
};

export default index;
export const getStaticProps = withI18n();
