import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

const ChatBubble = ({ role, content }) => {
  const isUser = role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-end gap-2 ${isUser ? "flex-row-reverse" : ""}`}
    >
      {!isUser && (
        <div className="mb-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-surface-hover">
          <Sparkles size={13} className="text-accent-violet" />
        </div>
      )}
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
          isUser
            ? "rounded-br-sm bg-gradient-to-r from-accent-blue to-accent-violet text-white"
            : "glass-panel rounded-bl-sm"
        }`}
      >
        {content}
      </div>
    </motion.div>
  );
};

export default ChatBubble;
