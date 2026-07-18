import { useEffect, useState } from "react";
import { Trophy } from "lucide-react";
import Layout from "../components/layout/Layout";
import BadgeCard from "../components/achievements/BadgeCard";
import { getAchievementCatalog } from "../api/achievements";

const AchievementsPage = () => {
  const [catalog, setCatalog] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getAchievementCatalog()
      .then((res) => setCatalog(res.data.data))
      .catch((err) => setError(err.response?.data?.message || "Failed to load achievements"))
      .finally(() => setIsLoading(false));
  }, []);

  const earnedCount = catalog.filter((b) => b.earned).length;

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="flex items-center gap-2 font-display text-2xl font-bold">
          <Trophy size={20} className="text-accent-emerald" />
          Achievements
        </h1>
        {!isLoading && (
          <p className="mt-1 text-sm text-ink-muted">
            {earnedCount} of {catalog.length} badges earned
          </p>
        )}
      </div>

      {isLoading ? (
        <p className="font-mono text-sm text-ink-muted">Loading...</p>
      ) : error ? (
        <p className="text-sm text-red-400">{error}</p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {catalog.map((badge, i) => (
            <BadgeCard key={badge.key} badge={badge} delay={i * 0.03} />
          ))}
        </div>
      )}
    </Layout>
  );
};

export default AchievementsPage;
