import { motion } from "framer-motion";
import { Lock } from "lucide-react";

const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

const BadgeCard = ({ badge, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3, delay }}
    className={`glass-panel rounded-xl p-4 text-center ${!badge.earned ? "opacity-40" : ""}`}
  >
    <div className="relative mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-surface-hover text-2xl">
      {badge.earned ? badge.icon : <Lock size={18} className="text-ink-muted" />}
    </div>
    <p className="mt-3 text-sm font-semibold">{badge.name}</p>
    <p className="mt-1 text-xs leading-snug text-ink-muted">{badge.description}</p>
    {badge.earned && badge.earnedAt && (
      <p className="mt-2 font-mono text-[10px] text-accent-emerald">
        Earned {formatDate(badge.earnedAt)}
      </p>
    )}
  </motion.div>
);

export default BadgeCard;
