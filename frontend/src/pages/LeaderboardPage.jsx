import { useEffect, useState } from "react";
import { Users, Trophy } from "lucide-react";
import Layout from "../components/layout/Layout";
import AddFriendForm from "../components/social/AddFriendForm";
import FriendRequestCard from "../components/social/FriendRequestCard";
import LeaderboardRow from "../components/social/LeaderboardRow";
import { getFriends, getIncomingRequests, respondToRequest } from "../api/friends";
import { getLeaderboard } from "../api/leaderboard";

const SORT_OPTIONS = [
  { value: "disciplineScore", label: "Score" },
  { value: "weeklyAverage", label: "Weekly %" },
  { value: "longestCurrentStreak", label: "Streak" },
];

const LeaderboardPage = () => {
  const [friends, setFriends] = useState([]);
  const [requests, setRequests] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [sortBy, setSortBy] = useState("disciplineScore");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAll = async () => {
    try {
      setError("");
      const [friendsRes, requestsRes, leaderboardRes] = await Promise.all([
        getFriends(),
        getIncomingRequests(),
        getLeaderboard(sortBy),
      ]);
      setFriends(friendsRes.data.data);
      setRequests(requestsRes.data.data);
      setLeaderboard(leaderboardRes.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load leaderboard");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortBy]);

  const handleRespond = async (id, action) => {
    await respondToRequest(id, action);
    fetchAll();
  };

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="flex items-center gap-2 font-display text-2xl font-bold">
          <Trophy size={20} className="text-accent-emerald" />
          Leaderboard
        </h1>
        <p className="mt-1 text-sm text-ink-muted">See how you stack up against your friends.</p>
      </div>

      {error && <p className="mb-4 text-sm text-red-400">{error}</p>}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Friends management */}
        <div className="space-y-4 lg:col-span-1">
          <div className="glass-panel rounded-xl p-5">
            <h2 className="mb-3 flex items-center gap-1.5 font-display text-base font-semibold">
              <Users size={15} /> Add a friend
            </h2>
            <AddFriendForm onSent={fetchAll} />
          </div>

          {requests.length > 0 && (
            <div className="glass-panel rounded-xl p-5">
              <h2 className="mb-3 font-display text-base font-semibold">
                Requests ({requests.length})
              </h2>
              <div className="space-y-2">
                {requests.map((r) => (
                  <FriendRequestCard key={r._id} request={r} onRespond={handleRespond} />
                ))}
              </div>
            </div>
          )}

          <div className="glass-panel rounded-xl p-5">
            <h2 className="mb-3 font-display text-base font-semibold">
              Friends ({friends.length})
            </h2>
            {friends.length === 0 ? (
              <p className="text-sm text-ink-muted">No friends yet - add one above.</p>
            ) : (
              <ul className="space-y-2">
                {friends.map((f) => (
                  <li key={f._id} className="flex items-center gap-2 text-sm">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-accent-blue to-accent-violet text-xs font-bold text-white">
                      {f.name?.[0]?.toUpperCase()}
                    </div>
                    {f.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Leaderboard */}
        <div className="glass-panel rounded-xl p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-base font-semibold">Rankings</h2>
            <div className="flex gap-1">
              {SORT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setSortBy(opt.value)}
                  className={`rounded-md px-2.5 py-1 text-xs font-medium transition ${
                    sortBy === opt.value
                      ? "bg-accent-violet/20 text-accent-violet"
                      : "text-ink-muted hover:bg-surface-hover"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {isLoading ? (
            <p className="font-mono text-sm text-ink-muted">Loading...</p>
          ) : (
            <div className="space-y-1.5">
              {leaderboard.map((entry) => (
                <LeaderboardRow key={entry.userId} entry={entry} sortBy={sortBy} />
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default LeaderboardPage;
