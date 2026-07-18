import { useState } from "react";
import { Link } from "react-router-dom";
import { Sparkles, Send } from "lucide-react";
import { chatWithCoach } from "../../api/ai";

/**
 * Lightweight preview widget for the dashboard - one message in, one reply
 * shown. The full multi-turn chat interface is Step 19.
 */
const AICoachCard = () => {
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");

  const handleSend = async (e) => {
    e.preventDefault();
    if (!message.trim() || isSending) return;

    setIsSending(true);
    setError("");
    try {
      const res = await chatWithCoach(message.trim());
      setReply(res.data.data.reply);
      setMessage("");
    } catch (err) {
      setError(err.response?.data?.message || "Coach is unavailable right now.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="glass-panel gradient-border rounded-xl p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-accent-violet" />
          <h2 className="font-display text-base font-semibold">AI Discipline Coach</h2>
        </div>
        <Link to="/coach" className="text-xs text-accent-violet hover:underline">
          Open chat →
        </Link>
      </div>

      {reply && (
        <div className="mt-3 rounded-lg bg-surface-hover px-4 py-3 text-sm leading-relaxed">{reply}</div>
      )}

      {error && <p className="mt-3 text-xs text-red-400">{error}</p>}

      <form onSubmit={handleSend} className="mt-3 flex gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask your coach anything..."
          className="flex-1 rounded-lg border border-border bg-transparent px-3 py-2 text-sm outline-none transition focus:border-accent-violet"
        />
        <button
          type="submit"
          disabled={isSending}
          aria-label="Send message to coach"
          className="flex items-center justify-center rounded-lg bg-gradient-to-r from-accent-blue via-accent-violet to-accent-emerald px-3 py-2 text-white transition hover:opacity-90 disabled:opacity-50"
        >
          <Send size={15} />
        </button>
      </form>
    </div>
  );
};

export default AICoachCard;
