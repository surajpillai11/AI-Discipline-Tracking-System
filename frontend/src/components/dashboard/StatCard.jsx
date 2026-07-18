import { motion } from "framer-motion";

const ACCENT_CLASSES = {
  blue: "text-accent-blue",
  violet: "text-accent-violet",
  emerald: "text-accent-emerald",
};

/**
 * value is rendered in the mono type role - numbers/stats get their own
 * distinct visual voice from body text throughout the dashboard.
 */
const StatCard = ({ label, value, suffix = "", icon: Icon, accent = "emerald", delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.35, delay }}
    className="glass-panel rounded-xl p-5"
  >
    <div className="flex items-center justify-between">
      <span className="text-xs font-medium uppercase tracking-wide text-ink-muted">{label}</span>
      {Icon && <Icon size={16} className={ACCENT_CLASSES[accent]} />}
    </div>
    <p className={`mt-2 font-mono text-3xl font-bold ${ACCENT_CLASSES[accent]}`}>
      {value}
      <span className="text-lg text-ink-muted">{suffix}</span>
    </p>
  </motion.div>
);

export default StatCard;
