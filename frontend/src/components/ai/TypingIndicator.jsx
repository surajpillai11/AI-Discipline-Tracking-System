import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

const dotVariants = {
  animate: (i) => ({
    y: [0, -4, 0],
    transition: { duration: 0.8, repeat: Infinity, delay: i * 0.15 },
  }),
};

const TypingIndicator = () => (
  <div className="flex items-end gap-2">
    <div className="mb-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-surface-hover">
      <Sparkles size={13} className="text-accent-violet" />
    </div>
    <div className="glass-panel flex items-center gap-1 rounded-2xl rounded-bl-sm px-4 py-3.5">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          custom={i}
          variants={dotVariants}
          animate="animate"
          className="h-1.5 w-1.5 rounded-full bg-ink-muted"
        />
      ))}
    </div>
  </div>
);

export default TypingIndicator;
