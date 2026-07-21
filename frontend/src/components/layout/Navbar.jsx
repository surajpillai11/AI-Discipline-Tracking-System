import { NavLink } from "react-router-dom";
import {
  Flame,
  LayoutDashboard,
  ListChecks,
  CalendarDays,
  BarChart3,
  Sparkles,
  Trophy,
  Users,
  UserCircle,
  LogOut,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { Sun, Moon } from "lucide-react";

const NAV_LINKS = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/habits", label: "Habits", icon: ListChecks },
  { to: "/calendar", label: "Calendar", icon: CalendarDays },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/coach", label: "Coach", icon: Sparkles },
  { to: "/achievements", label: "Achievements", icon: Trophy },
  { to: "/leaderboard", label: "Leaderboard", icon: Users },
  { to: "/profile", label: "Profile", icon: UserCircle },
];

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="glass-panel sticky top-4 z-20 mx-auto mb-6 flex max-w-5xl items-center justify-between rounded-xl px-4 py-2.5 xl:max-w-6xl 2xl:max-w-7xl">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <Flame className="text-accent-emerald" size={18} />
          <span className="font-display text-sm font-semibold hidden sm:inline">
            Discipline Tracker
          </span>
        </div>

        <nav className="flex items-center gap-1 overflow-x-auto">
          {NAV_LINKS.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                  isActive
                    ? "bg-accent-violet/10 text-accent-violet"
                    : "text-ink-muted hover:text-ink"
                }`
              }
            >
              <Icon size={14} />
              <span className="hidden sm:inline">{label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-2">
        <span className="hidden text-sm text-ink-muted sm:inline">{user?.name}</span>
        <button
          onClick={toggleTheme}
          aria-label="Toggle dark/light mode"
          className="flex h-9 w-9 items-center justify-center rounded-full transition hover:bg-surface-hover"
        >
          {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
        </button>
        <button
          onClick={logout}
          aria-label="Log out"
          className="flex h-9 w-9 items-center justify-center rounded-full transition hover:bg-surface-hover"
        >
          <LogOut size={16} />
        </button>
      </div>
    </header>
  );
};

export default Navbar;
