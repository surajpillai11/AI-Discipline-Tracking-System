import { useState } from "react";
import { UserPlus } from "lucide-react";
import { sendFriendRequest } from "../../api/friends";

const AddFriendForm = ({ onSent }) => {
  const [email, setEmail] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSending(true);
    setMessage({ type: "", text: "" });
    try {
      await sendFriendRequest(email.trim());
      setMessage({ type: "success", text: "Friend request sent." });
      setEmail("");
      onSent?.();
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.message || "Failed to send request" });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="friend@example.com"
          className="flex-1 rounded-lg border border-border bg-transparent px-3 py-2 text-sm outline-none transition focus:border-accent-violet"
        />
        <button
          type="submit"
          disabled={isSending}
          className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-accent-blue via-accent-violet to-accent-emerald px-3 py-2 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-50"
        >
          <UserPlus size={14} />
          Add
        </button>
      </form>
      {message.text && (
        <p className={`mt-2 text-xs ${message.type === "error" ? "text-red-400" : "text-accent-emerald"}`}>
          {message.text}
        </p>
      )}
    </div>
  );
};

export default AddFriendForm;
