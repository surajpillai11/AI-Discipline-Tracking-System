import { useEffect, useRef, useState } from "react";
import { Trash2, Sparkles } from "lucide-react";
import Layout from "../components/layout/Layout";
import ChatBubble from "../components/ai/ChatBubble";
import ChatInput from "../components/ai/ChatInput";
import TypingIndicator from "../components/ai/TypingIndicator";
import SuggestionChips from "../components/ai/SuggestionChips";
import { chatWithCoach, getCoachHistory, clearCoachHistory } from "../api/ai";

const AICoachPage = () => {
  const [messages, setMessages] = useState([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");
  const [confirmingClear, setConfirmingClear] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    getCoachHistory(50)
      .then((res) => setMessages(res.data.data))
      .catch((err) => setError(err.response?.data?.message || "Failed to load chat history"))
      .finally(() => setIsLoadingHistory(false));
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isSending]);

  const handleSend = async (text) => {
    setError("");
    setMessages((prev) => [...prev, { role: "user", content: text, createdAt: new Date().toISOString() }]);
    setIsSending(true);

    try {
      const res = await chatWithCoach(text);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: res.data.data.reply, createdAt: new Date().toISOString() },
      ]);
    } catch (err) {
      setError(err.response?.data?.message || "Coach is unavailable right now.");
    } finally {
      setIsSending(false);
    }
  };

  const handleClear = async () => {
    if (!confirmingClear) {
      setConfirmingClear(true);
      setTimeout(() => setConfirmingClear(false), 3000); // auto-cancel confirm state
      return;
    }
    await clearCoachHistory();
    setMessages([]);
    setConfirmingClear(false);
  };

  return (
    <Layout>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-2 font-display text-2xl font-bold">
            <Sparkles size={20} className="text-accent-violet" />
            AI Coach
          </h1>
          <p className="mt-1 text-sm text-ink-muted">Grounded in your actual habits and streaks.</p>
        </div>
        {messages.length > 0 && (
          <button
            onClick={handleClear}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
              confirmingClear
                ? "bg-red-400/15 text-red-400"
                : "text-ink-muted hover:bg-surface-hover hover:text-ink"
            }`}
          >
            <Trash2 size={12} />
            {confirmingClear ? "Click again to confirm" : "Clear chat"}
          </button>
        )}
      </div>

      <div className="glass-panel flex h-[65vh] flex-col rounded-2xl p-4">
        <div className="flex-1 overflow-y-auto px-1">
          {isLoadingHistory ? (
            <p className="mt-6 text-center font-mono text-sm text-ink-muted">Loading...</p>
          ) : messages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-hover">
                <Sparkles size={20} className="text-accent-violet" />
              </div>
              <div>
                <p className="text-sm font-medium">Your discipline coach is ready</p>
                <p className="mt-1 text-xs text-ink-muted">
                  Ask about your streaks, get a nudge, or talk through a rough day.
                </p>
              </div>
              <SuggestionChips onPick={handleSend} />
            </div>
          ) : (
            <div className="space-y-4 py-2">
              {messages.map((m, i) => (
                <ChatBubble key={i} role={m.role} content={m.content} />
              ))}
              {isSending && <TypingIndicator />}
              <div ref={scrollRef} />
            </div>
          )}
        </div>

        {error && <p className="mt-2 px-1 text-xs text-red-400">{error}</p>}

        <div className="mt-3">
          <ChatInput onSend={handleSend} disabled={isSending} />
        </div>
      </div>
    </Layout>
  );
};

export default AICoachPage;
